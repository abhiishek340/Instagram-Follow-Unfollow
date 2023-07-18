const fetchOptions = {
  credentials: "include",
  headers: {
    "X-IG-App-ID": "936619743392459",
  },
  method: "GET",
};

async function getUserFriendshipStats(username) {
  const fetchWithCredentials = (url) => fetch(url, fetchOptions).then((r) => r.json());

  const concatFriendshipsApiResponse = async (list, user_id, count, next_max_id = "") => {
    const url = `https://www.instagram.com/api/v1/friendships/${user_id}/${list}/?count=${count}` + (next_max_id ? `&max_id=${next_max_id}` : "");
    const data = await fetchWithCredentials(url);

    if (data.next_max_id) {
      const timeToSleep = Math.ceil(Math.random() * 400) + 100;
      console.log(`Loaded ${data.users.length} ${list}. Sleeping ${timeToSleep}ms to avoid rate limiting`);
      await new Promise(resolve => setTimeout(resolve, timeToSleep));
      return data.users.concat(await concatFriendshipsApiResponse(list, user_id, count, data.next_max_id));
    }

    return data.users;
  };

  const getFollowers = async (user_id, count = 50) => {
    const followers = await concatFriendshipsApiResponse("followers", user_id, count);
    return followers.map((follower) => follower.username.toLowerCase());
  };

  const getFollowing = async (user_id, count = 50) => {
    const following = await concatFriendshipsApiResponse("following", user_id, count);
    return following.map((followed) => followed.username.toLowerCase());
  };

  const getUserId = async (username) => {
    const url = `https://www.instagram.com/api/v1/web/search/topsearch/?context=blended&query=${username.toLowerCase()}&include_reel=false`;
    const data = await fetchWithCredentials(url);
    const result = data.users?.find((result) => result.user.username.toLowerCase() === username.toLowerCase());
    return result?.user?.pk || null;
  };

  const user_id = await getUserId(username);
  if (!user_id) throw new Error(`Could not find user with username ${username}`);

  const [followersUsernames, followingUsernames] = await Promise.all([
    getFollowers(user_id),
    getFollowing(user_id)
  ]);

  const followerSet = new Set(followersUsernames);
  const followingSet = new Set(followingUsernames);

  console.log("-".repeat(28));
  console.log(`Fetched ${followerSet.size} followers and ${followingSet.size} following.`);
  console.log("If this doesn't seem right then some of the output might be inaccurate");

  const PeopleIDontFollowBack = Array.from(followerSet).filter((follower) => !followingSet.has(follower));
  const PeopleNotFollowingMeBack = Array.from(followingSet).filter((following) => !followerSet.has(following));

  return {
    PeopleIDontFollowBack,
    PeopleNotFollowingMeBack,
  };
}

const username = "example_username"; // Replace with your Instagram username
getUserFriendshipStats(username).then(console.log);
