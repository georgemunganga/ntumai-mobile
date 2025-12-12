# Git Workflow Guide - NTUMAI Mobile App

## Overview

This guide explains how to work with Git for the NTUMAI mobile app project. We use a simple workflow with the `main` branch for all development.

## Initial Setup (Already Done ✅)

```bash
# Initialize repository
git init

# Configure user
git config user.email "dev@ntumai.com"
git config user.name "NTUMAI Dev Team"

# Add remote
git remote add origin https://github.com/georgemunganga/ntumai-mobile.git

# Create initial commit
git add .
git commit -m "Initial commit: Complete NTUMAI mobile app..."
git branch -M main
git push -u origin main
```

## Workflow for Daily Development

### 1. Before Starting Work

```bash
# Pull latest changes
git pull origin main
```

### 2. Make Changes

Edit files as needed for your feature or fix.

### 3. Check Status

```bash
# See what files changed
git status

# See what changed in each file
git diff
```

### 4. Stage Changes

```bash
# Stage specific files
git add src/api/mockAuthServices.ts
git add app/(auth)/OtpStart.improved.tsx

# Or stage all changes
git add .
```

### 5. Commit Changes

Use clear, descriptive commit messages following this format:

```bash
git commit -m "feat: Add improved OTP authentication flow

- Implement backend-driven flow determination
- Add E.164 phone number normalization
- Add SessionId-only OTP verification
- Implement onboarding token for new users"
```

### 6. Push to GitHub

```bash
# Push to main branch
git push origin main
```

## Commit Message Format

Use conventional commits for clarity:

```
<type>: <subject>

<body>

<footer>
```

### Types

- **feat**: New feature
- **fix**: Bug fix
- **refactor**: Code refactoring
- **docs**: Documentation
- **test**: Tests
- **chore**: Build, dependencies, etc.
- **perf**: Performance improvements
- **security**: Security fixes

### Examples

```bash
# Feature
git commit -m "feat: Implement improved OTP authentication

- Add backend-driven flow determination
- Implement E.164 phone normalization
- Add onboarding token for new users"

# Bug fix
git commit -m "fix: Correct phone number validation regex

- Update regex to match E.164 format
- Add test cases for various formats"

# Documentation
git commit -m "docs: Add authentication implementation guide

- Document all API endpoints
- Add testing checklist
- Add troubleshooting guide"

# Refactoring
git commit -m "refactor: Simplify auth store implementation

- Remove redundant state
- Consolidate token management
- Improve type safety"
```

## Common Tasks

### View Commit History

```bash
# Last 5 commits
git log --oneline -5

# With details
git log --oneline --graph -10

# By author
git log --oneline --author="NTUMAI Dev Team"
```

### Undo Changes

```bash
# Discard changes in working directory
git checkout -- src/api/mockAuthServices.ts

# Unstage a file
git reset HEAD src/api/mockAuthServices.ts

# Undo last commit (keep changes)
git reset --soft HEAD~1

# Undo last commit (discard changes)
git reset --hard HEAD~1
```

### View Differences

```bash
# Changes in working directory
git diff

# Changes staged for commit
git diff --cached

# Changes between commits
git diff HEAD~1 HEAD

# Changes in specific file
git diff src/api/mockAuthServices.ts
```

### Create a Feature Branch (Optional)

If you want to work on a feature separately before merging to main:

```bash
# Create and switch to new branch
git checkout -b feature/improved-auth

# Make changes and commit
git add .
git commit -m "feat: Add improved auth flow"

# Push branch to GitHub
git push origin feature/improved-auth

# Later, merge back to main
git checkout main
git merge feature/improved-auth
git push origin main
```

## Milestones and Tags

When reaching important milestones, create a tag:

```bash
# Create a tag
git tag -a v1.0.0-auth -m "Milestone: Improved authentication implemented"

# Push tags to GitHub
git push origin --tags

# List tags
git tag -l

# View tag details
git show v1.0.0-auth
```

## Troubleshooting

### Push Rejected

```bash
# Someone else pushed changes, pull first
git pull origin main
git push origin main
```

### Merge Conflicts

```bash
# After pulling, resolve conflicts manually
# Then stage and commit
git add .
git commit -m "Merge: Resolve conflicts from main"
```

### Lost Commits

```bash
# View all commits (including deleted ones)
git reflog

# Recover a commit
git reset --hard <commit-hash>
```

## Best Practices

1. **Commit Often** - Make small, logical commits
2. **Clear Messages** - Write descriptive commit messages
3. **Pull Before Push** - Always pull latest before pushing
4. **Test Before Commit** - Ensure changes work before committing
5. **Review Changes** - Use `git diff` to review before committing
6. **Meaningful Branches** - Use clear branch names if using feature branches
7. **Keep History Clean** - Avoid unnecessary merge commits

## GitHub Token

The token is already configured for pushing. If you need to update it:

```bash
# Using token in URL (already set up)
git push https://<token>@github.com/georgemunganga/ntumai-mobile.git main

# Or configure git credentials
git config --global credential.helper store
```

## Quick Reference

```bash
# Check status
git status

# See changes
git diff

# Stage changes
git add .

# Commit
git commit -m "message"

# Push
git push origin main

# Pull
git pull origin main

# View history
git log --oneline

# Create tag
git tag -a v1.0.0 -m "message"

# Push tags
git push origin --tags
```

---

**Last Updated:** December 12, 2025  
**Repository:** https://github.com/georgemunganga/ntumai-mobile.git  
**Branch:** main
