# 🛠️ Development Guide

## 🚨 URGENT: Pipeline Status & Required Actions

**Last Updated:** 2025-06-16  
**Current Branch:** `codex/correct-smacna-logic-issues`

### 📊 Pipeline Health Dashboard

| Component | Status | Priority | Action Required |
|-----------|--------|----------|-----------------|
| **Tests** | ✅ PASSING | ✅ | None - All 31 tests pass |
| **Dependencies** | ✅ RESOLVED | ✅ | None - All packages installed |
| **Jest Config** | ✅ FIXED | ✅ | None - Configuration corrected |
| **Linting** | ⚠️ 7 ISSUES | 🟡 Medium | Fix remaining lint issues |
| **TypeScript** | ❌ ~15 ERRORS | 🔴 **CRITICAL** | **MUST FIX BEFORE DEVELOPMENT** |
| **Build** | ❌ FAILING | 🔴 **CRITICAL** | Blocked by TypeScript errors |
| **CI/CD** | ✅ CONFIGURED | ✅ | Ready once build fixes complete |

## 🔥 CRITICAL: Fix These First

### 1. TypeScript Build Errors (BLOCKING)

**Status:** ❌ **BUILD FAILING**  
**Impact:** Prevents all development work  
**Estimated Fix Time:** 2-3 hours

```bash
# Check current errors
npm run type-check

# Expected errors (~15 total):
# - src/hooks/useDuctResults.ts: null vs undefined mismatches
# - src/components/ui/SMACNAResultsTable.tsx: missing props
# - src/tools/air-duct-sizer/ui.tsx: type inconsistencies
# - src/utils/smacnaUtils.ts: missing properties
```

**Specific Fixes Needed:**

#### A. Hook Type Mismatches (`src/hooks/useDuctResults.ts`)
```typescript
// PROBLEM: null vs undefined inconsistency
error: string | undefined  // but setting to null

// FIX: Use undefined consistently
setState(prev => ({ ...prev, error: undefined }))
```

#### B. Component Props (`src/components/ui/SMACNAResultsTable.tsx`)
```typescript
// PROBLEM: Missing 'title' prop in StatusIndicator
<StatusIndicator status={status} title={someTitle} />

// FIX: Add title prop or make it optional
```

#### C. Type Definitions (`src/tools/air-duct-sizer/ui.tsx`)
```typescript
// PROBLEM: ResultItem vs ResultItem[] confusion
results={ductResults[0]}  // expects ResultItem[]

// FIX: Align type usage
results={ductResults}
```

### 2. Linting Issues (NON-BLOCKING)

**Status:** ⚠️ **7 ISSUES REMAINING**  
**Impact:** Code quality warnings  
**Estimated Fix Time:** 30 minutes

```bash
# Auto-fix what's possible
npm run lint:fix

# Manually fix remaining:
# - Remove unused 'application' parameter
# - Fix React refresh component export warnings
# - Replace remaining 'any' type
```

## 🚀 Development Workflow

### Before Starting Any Work

```bash
# 1. Verify current status
npm run lint && npm run type-check && npm test

# 2. If any fail, fix issues first
# 3. Only proceed when all pass
```

### Daily Development Routine

```bash
# Morning setup
git pull origin main
npm install  # if package.json changed
npm test     # verify tests pass

# Before committing
npm run lint:fix
npm run type-check
npm test
npm run build  # must pass before commit

# Commit only if all pass
git add .
git commit -m "feat: your changes"
```

### Branch Strategy

- **main**: Production-ready code only
- **develop**: Integration branch (not yet created)
- **feature/***: New features
- **fix/***: Bug fixes
- **docs/***: Documentation updates

## 🔧 Pipeline Configuration

### CI/CD Workflow (`.github/workflows/ci-cd.yml`)

**Status:** ✅ **FULLY CONFIGURED**

```yaml
# Runs on: push to main/develop, PRs to main
# Tests: Node.js 18.x, 20.x
# Steps: install → lint → test → build → deploy
# Deploy: GitHub Pages (main branch only)
```

### Quality Gates

All PRs must pass:
- ✅ Linting (ESLint + Prettier)
- ✅ Type checking (TypeScript strict)
- ✅ Tests (Jest + React Testing Library)
- ✅ Build (Vite production build)
- ✅ Coverage (85% minimum)

## 📋 Available Commands

### Development
```bash
npm run dev          # Start dev server (port 3000)
npm run preview      # Preview production build
npm run storybook    # Start Storybook (coming soon)
```

### Quality Assurance
```bash
npm run lint         # Check linting issues
npm run lint:fix     # Auto-fix linting issues
npm run format       # Format with Prettier
npm run type-check   # TypeScript type checking
```

### Testing
```bash
npm test             # Run all tests
npm run test:watch   # Run tests in watch mode
npm run test:coverage # Run with coverage report
```

### Build & Deploy
```bash
npm run build        # Production build (currently failing)
```

## 🎯 Immediate Action Plan

### For New Developers

1. **DO NOT START FEATURE WORK** until TypeScript errors are fixed
2. **Focus on fixing build issues first**
3. **Follow the priority order** listed above
4. **Ask for help** if stuck on TypeScript errors

### For Project Leads

1. **Assign TypeScript fixes** as highest priority
2. **Block new feature PRs** until build passes
3. **Review this document** with the team
4. **Update status** when issues are resolved

## 📞 Getting Help

### TypeScript Issues
- Check official TypeScript docs
- Use `npm run type-check` for detailed errors
- Ask team for help with complex type definitions

### Build Issues
- Ensure Node.js 18+ is installed
- Clear cache: `npm cache clean --force`
- Reinstall: `rm -rf node_modules package-lock.json && npm install`

### Pipeline Issues
- Check GitHub Actions logs
- Verify all quality gates pass locally first
- Review this document for current status

---

**⚠️ REMEMBER: Fix TypeScript errors before any other development work!**
