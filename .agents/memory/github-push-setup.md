---
name: GitHub push setup
description: How this project must authenticate when pushing to GitHub
---

# GitHub push setup

- Backup repo: `origin` = github.com/tidyups-booking/AppBuilders (GitHub account `tidyups-booking`). The user's GitLab account cannot be used; the backup workflow is GitHub-only.
- **Rule:** push with the `GITHUB_PERSONAL_ACCESS_TOKEN` Replit secret passed as an `http.extraHeader` basic auth header (user `x-access-token`), with `credential.helper=` disabled.
- **Why:** Replit's built-in GitHub push (gitPush callback and shell askpass) is rejected for this workspace even after re-authorization, and the GitHub connector proxy blocks ref-moving endpoints — so PAT-authenticated git is the only reliable path.
- **How to apply:** any time commits must reach GitHub (backups, workflow fixes), use the PAT method; do not assume the Git pane connection works.
