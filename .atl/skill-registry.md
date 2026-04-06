# Skill Registry

**Generated**: Sun Apr 05 2026
**Source**: User-level skills (opencode, claude)

## Available Skills

### SDD Workflow (Spec-Driven Development)

| Skill | Location | Purpose |
|-------|----------|---------|
| sdd-init | ~/.config/opencode/skills/sdd-init | Initialize SDD context, detect stack |
| sdd-explore | ~/.config/opencode/skills/sdd-explore | Explore and investigate ideas |
| sdd-propose | ~/.config/opencode/skills/sdd-propose | Create change proposals |
| sdd-spec | ~/.config/opencode/skills/sdd-spec | Write specifications (delta specs) |
| sdd-design | ~/.config/opencode/skills/sdd-design | Technical design documents |
| sdd-tasks | ~/.config/opencode/skills/sdd-tasks | Implementation task checklists |
| sdd-apply | ~/.config/opencode/skills/sdd-apply | Implement tasks from changes |
| sdd-verify | ~/.config/opencode/skills/sdd-verify | Validate implementation against specs |
| sdd-archive | ~/.config/opencode/skills/sdd-archive | Sync deltas to main specs |
| sdd-onboard | ~/.config/opencode/skills/sdd-onboard | Guided SDD workflow walkthrough |

### Specialized

| Skill | Location | Purpose |
|-------|----------|---------|
| go-testing | ~/.config/opencode/skills/go-testing | Go testing patterns |
| judgment-day | ~/.config/opencode/skills/judgment-day | Parallel adversarial review |
| issue-creation | ~/.config/opencode/skills/issue-creation | Issue creation workflow |
| branch-pr | ~/.config/opencode/skills/branch-pr | PR creation workflow |
| skill-creator | ~/.config/opencode/skills/skill-creator | Create new AI agent skills |
| skill-registry | ~/.config/opencode/skills/skill-registry | Update skill registry |

## Project Conventions

**From**: AGENTS.md, CLAUDE.md

### Next.js 16 Specific Rules
- This is NOT the Next.js you know - APIs, conventions, and file structure differ from training data
- Always read relevant guide in `node_modules/next/dist/docs/` before writing code
- Heed deprecation notices

### Git & Commits
- Never add "Co-Authored-By" or AI attribution to commits
- Use conventional commits only

### Code Quality
- Never build after changes
- Verify technical claims before stating - if unsure, investigate first
- Use `dejame verificar` (let me verify) before agreeing with claims

### Communication Style
- Spanish input → Rioplatense Spanish (voseo): "bien", "¿se entiende?", "es así de fácil"
- English input → Same warm energy: "here's the thing", "it's that simple"
- Direct but from caring - validate question, explain WHY, show correct way

### Project Architecture
- Module-based structure: modules/ {shared, landing, analysis, dashboard, history, payment}
- Co-located: hooks, components, types, API, lib within each module
- Path aliases: @/* → project root
- React Server Components enabled
- State management: @tanstack/react-query

### Tech Stack
- Framework: Next.js 16.2.2 + React 19.2.4
- Language: TypeScript 5 (strict mode)
- UI: shadcn/ui (radix-nova), Radix UI, Tailwind CSS 4
- Testing: Vitest 4.1.2 + @testing-library/react
- Linting: ESLint 9 with eslint-config-next

## Notes

- Skill registry is mode-independent (not an SDD artifact)
- Skipped: `sdd-*`, `_shared`, `skill-registry` from source scan
- Project-level: no local skills detected in this project
- All SDD skills available via opencode skill loader
- SDD initialized in `engram` mode - no openspec directory, artifacts persisted to Engram
