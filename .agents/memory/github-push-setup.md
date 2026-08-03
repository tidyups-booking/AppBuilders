---
name: GitHub push setup
description: How this project authenticates to GitHub and quirks discovered while wiring the backup repo
---

# GitHub push setup

- The project pushes to `origin` = https://github.com/tidyups-booking/AppBuilders.git (public repo, account `tidyups-booking`). The user's GitLab account (BookCleaning.App) cannot be used — Replit git tooling and the backup workflow are GitHub-only.
- **Working push method:** the `GITHUB_PERSONAL_ACCESS_TOKEN` Replit secret with
  `git -c credential.helper= -c http.extraHeader="Authorization: Basic $(printf 'x-access-token:%s' "$GITHUB_PERSONAL_ACCESS_TOKEN" | base64 -w0)" push origin main`.
  **Why:** Replit's `gitPush` callback and the shell askpass both failed persistently (PUSH_REJECTED / BRANCH_ALREADY_EXISTS / "Invalid username or token"), even after the user re-authorized in the Git pane.
- The GitHub *connector* proxy works for most REST endpoints but **blocks** `POST/PATCH /git/refs` and `POST /merges` (404) and workflow-file writes (403, no `workflow` scope). Blobs/trees/commits/contents/branch-rename/repo PATCH all work.
- `listConnections('github')` returns `[]` in the agent sandbox; the connectors SDK works from a normal Node script on disk (e.g. a /tmp package with `@replit/connectors-sdk` installed).
- EAS builds run in GitHub Actions (`.github/workflows/react-native-cicd.yml`): needs `EXPO_TOKEN` repo secret (robot token, Expo account `bookscrubby`), `packageManager` in root package.json, EAS projectId/owner and `android.package`/`ios.bundleIdentifier` (`com.tidyupsbooking.mobile`) in `artifacts/mobile/app.json`. Push-triggered builds use the `production-apk` profile; the `development` profile requires `expo-dev-client` (not installed).
- Google Drive upload secrets (RCLONE_CONFIG_GDRIVE_*) are optional and not configured; the workflow skips the upload.
