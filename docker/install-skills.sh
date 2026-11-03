#!/usr/bin/env bash
# Installs the project-level Claude Code skills into .claude/skills.
# Run inside the dev container: docker compose run --rm app bash docker/install-skills.sh
# --copy: Claude Code may read the repo from Windows (\\wsl.localhost), where Linux symlinks don't resolve.
set -euo pipefail

skills_add() {
  npx -y skills@1.7.6 add "$@" --agent claude-code --copy -y
}

skills_add vercel-labs/agent-skills --skill vercel-react-best-practices
skills_add vercel-labs/agent-skills --skill web-design-guidelines
skills_add vercel/next.js --skill next-dev-loop
skills_add https://github.com/greensock/gsap-skills
skills_add remotion-dev/skills
skills_add addyosmani/web-quality-skills --skill seo
skills_add addyosmani/web-quality-skills --skill core-web-vitals
skills_add coreyhaines31/marketingskills --skill seo-audit

npx -y skills@1.7.6 ls -a claude-code
