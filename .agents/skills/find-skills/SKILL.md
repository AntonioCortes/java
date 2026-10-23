---
name: find-skills
description: >-
  Discover, search, and install agent skills from the open skills ecosystem (skills.sh)
  and GitHub registries when the user asks to find, add, or search for specialized skills.
---

# Find Skills (Skill Discovery & Installer)

This meta-skill teaches the agent how to search, discover, and install community and official skills for coding assistants and CLI agents.

## When to Use

- When the user asks: *"Find a skill for X"*, *"Is there a skill that can do Y?"*, or *"Search skills for Z"*.
- When you encounter a specialized domain or tool (e.g., Supabase, Playwright, Kubernetes, Tailwind) where a pre-packaged community skill would significantly improve quality.

## Procedures

### 1. Searching for Skills

To search the open agent skills registry (`skills.sh`), execute:

```bash
npx skills find <keyword-or-topic>
```

Examples:
- `npx skills find docker`
- `npx skills find spring-boot`
- `npx skills find test-driven-development`

If offline or running without network access in a sandboxed shell, suggest running with network access or use web search tools to locate repositories under `antigravity-awesome-skills` or `vercel-labs/skills`.

### 2. Evaluating Quality

Before installing or recommending a skill, check:
- Total downloads / installations on `skills.sh`.
- GitHub repository stars and recent commit activity.
- Structure of the `SKILL.md` file (clear description, progressive disclosure, no conflicting rules).

### 3. Installing Skills

#### A. In Current Workspace (Recommended for Project Sharing & Git Sync)
```bash
npx skills add <owner/repo> --skill <skill-name>
```
Or manually create the folder:
```text
.agents/skills/<skill-name>/SKILL.md
```
*Note: Committing and pushing `.agents/skills/` to Git syncs the skill across all computers cloning the repo.*

#### B. Globally on Current Machine
```bash
npx skills add <owner/repo> --skill <skill-name> --global
```
Or manually place in:
```text
~/.gemini/config/skills/<skill-name>/SKILL.md
```
*(Requires elevated / bypass sandbox permissions to write to global home directory).*

### 4. Updating and Managing Skills

- Check for updates: `npx skills check`
- Update all installed skills: `npx skills update`
- Remove a skill: `npx skills remove <skill-name>`
