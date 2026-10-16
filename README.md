<div align="center">

# Instagram Follow / Unfollow Checker

**A small read-only JavaScript snippet that compares your Instagram followers with the accounts you follow.**

<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" alt="JavaScript"/>

</div>

---

## Overview

`unfollow_checker.js` looks up your account ID and pages through your followers and following lists using Instagram's internal web endpoints. It then prints two lists to the console:

- **`PeopleNotFollowingMeBack`**: accounts you follow that don't follow you.
- **`PeopleIDontFollowBack`**: accounts that follow you that you don't follow.

The script only reads data. It does not follow, unfollow, like or message anyone.

## How it works

1. Resolves the username to a user ID through the web search endpoint (`/api/v1/web/search/topsearch/`).
2. Fetches `/api/v1/friendships/{id}/followers/` and `/following/` 50 at a time, following `next_max_id` cursors. It waits a random 100–500 ms between pages.
3. Lowercases the usernames, builds two `Set`s and returns the differences between them.

Requests use `credentials: "include"`, so they rely on your existing logged-in instagram.com session cookies. No password or token is stored in the script.

## Usage

1. Open `unfollow_checker.js` and replace `example_username` with your own username.
2. While logged in on instagram.com, paste the script into the browser's developer console and run it. The results are logged as an object.

The script will not work as-is from Node.js, because it needs the browser session cookies.

## Project structure

```
unfollow_checker.js            # The script
const fetchOptions = {.dart    # Duplicate copy of the same JavaScript (misnamed file)
```

## Notes

- **Terms of Use:** automated or scripted access to Instagram may violate [Instagram's Terms of Use](https://help.instagram.com/581066165581870). Using it could get your account rate-limited or restricted. Use it at your own risk, on your own account only.
- The script depends on undocumented internal endpoints and headers, which Instagram can change or block at any time.
- Large accounts take longer, and partial responses can make the counts wrong. The script prints the totals it fetched so you can sanity-check them.

---

<div align="center">
Built by <a href="https://github.com/abhiishek340">Abhishek Yadav</a>
</div>
