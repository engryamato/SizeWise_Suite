# SizeWise Suite Folder & File Migration Checklist

This checklist consolidates all must-follow instructions, constraints, and organizational guidelines from the following foundational documents:
- Day 0 Kickoff Plan.txt
- SizeWise Suite UI:UX Design Plan.txt
- SizeWise Roadmap.txt
- SizeWise Suite Folders.txt
As well as alignment with the target structure in Updated Folder Structure (Future Proof).txt

---

## 1. Naming & Folder Organization

- [ ] Use **kebab-case** for all folders (e.g., `duct-sizer`, `grease-duct-sizer`).
- [ ] Major root folder: `/app/` for all application logic and submodules.
- [ ] Separation of assets: `/assets/` for raw sources (fonts, SVG, videos), `/static/` for app-serving assets (CSS, images, bundled JS).
- [ ] Place shared logic, validation engines, and registrars in `/core/`.
- [ ] Configuration and defaults in `/config/`.
- [ ] Language packs and i18n in `/i18n/` (future: `/locales/`).
- [ ] Plugins to go in `/plugins/`.
- [ ] Simulation logic in `/simulations/`.
- [ ] Tests under `/tests/` (with subfolders for `unit`, `integration`, `e2e`, and tool/test fixtures).
- [ ] Tool code modular: Each tool in `/tools/<tool-name>/` with its own assets, logic, config, tests, components, and docs.

## 2. File Placement & Content

- [ ] Place all configuration as `.json` in `/config/environment/` and (where needed) in tool subfolders.
- [ ] Use `.js` files for all main logic/components/hooks, `.json` for config/schemas/locales, `.md` for docs.
- [ ] Colocate validators, schemas, and test suites near the logic/component they test.
- [ ] Place shared UI/layout components (HeaderBar, SidebarNav, etc.) in `/app/ui/components/`.
- [ ] Theme/style files go in `/app/ui/themes/` and `/app/ui/styles/`.
- [ ] All public-facing static files go under `/static/`.

## 3. Migration Steps and Data Handling

- [ ] **Preserve all relevant existing content; do not delete code or assets unless specifically outdated or marked as temporary.**
- [ ] Migrate legacy tool folders to new structure (e.g., `ductsizer` → `tools/duct-sizer`).
- [ ] Move or rename any docs, readmes, configuration, and templates into their corresponding new locations.
- [ ] Combine/merge logic files if a tool’s code was previously scattered.
- [ ] Archive or move any old/legacy/not-to-be-maintained scripts/folders to an `/archive/` or `/docs/old/` area if still potentially referenceable.
- [ ] Remove or ignore temporary files (`~$...txt`, OS/project backup debris).
- [ ] For files shared between tools, move to `/core/` or `/lib/` as directed.

## 4. Workflow & Quality Requirements

- [ ] **Initialize version control (git) and commit all structural changes stepwise.**
- [ ] Use TypeScript and modern frontend stack: Create React App (or Vite, if preferred), TailwindCSS, ESLint, Prettier.
- [ ] Set up `.vscode/` and basic CI/CD via `.github/workflows/`, including automatic testing and linting.
- [ ] All UI components: Must follow accessibility and WCAG 2.1 AA, with functionality for themes, live validation, and real-time feedback.
- [ ] Storybook for UI development and documentation (`.storybook/` and `/docs/`).
- [ ] UI and workflow designed for fast dev onboarding and modular scaling (shared tokens, provider wrappers, utility hooks).
- [ ] CI/CD workflow must ensure all key PRs are built, tested, and passing before merge.
- [ ] Legacy or prototype code should be documented and, if not in use, clearly marked as such.

## 5. Testing & Documentation

- [ ] Unit and integration tests established at `/tests/` and per-tool `/tools/<tool>/tests/`.
- [ ] Include at least one working Jest unit test for each tool; set up test infra with jsdom.
- [ ] Documentation for each tool, UI component, and validator under `/docs/` (using `.md` files).
- [ ] Annotate any architectural decisions with ADRs under `/docs/architecture/` or similar.
- [ ] Ensure inline help for all user inputs (validation, tooltips, compliance callouts).
- [ ] All template files (for Flask/Jinja, etc.) placed under `/templates/` according to their use.

---

## Additional Constraints For Migration

- [ ] Refer to "Day 0 Kickoff Plan.txt" for step-by-step tooling, repo, and CI conventions (follow order and tool choices unless a newer doc supersedes).
- [ ] Ensure consistency with any cross-document folder overlapping (e.g., both UI/UX plan and folders.txt describe `/tools/duct-sizer/`; keep only one canonical version).
- [ ] For language/i18n, begin with `/i18n/` if present, then move toward `/locales/` as the project expands.
- [ ] All moves, deletions, or renames should be logged and reversible (commit atomically).
- [ ] Where files are not covered by new structure, prompt for manual review before deletion.

---

> **Use this checklist as a post-flight for each major migration step. All boxes should be checked before finalizing your structural migration.**

