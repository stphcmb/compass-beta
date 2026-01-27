#!/bin/bash
#
# Install git hooks for author data validation
#
# Usage:
#   bash scripts/install_git_hooks.sh
#

echo "📦 Installing git hooks for author data validation..."

# Check if .git directory exists
if [ ! -d ".git" ]; then
  echo "❌ Error: Not in a git repository root"
  echo "   Please run this script from the project root directory"
  exit 1
fi

# Create hooks directory if it doesn't exist
mkdir -p .git/hooks

# Copy pre-commit hook
cp scripts/git-hooks/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit

echo "✅ Pre-commit hook installed successfully!"
echo ""
echo "The hook will now run validation before every commit."
echo ""
echo "What it checks:"
echo "  ✓ All authors have camp relationships"
echo "  ✓ All camp relationships have quotes"
echo "  ✓ All authors have at least 3 sources"
echo ""
echo "To bypass validation (NOT RECOMMENDED):"
echo "  git commit --no-verify"
echo ""
echo "To uninstall:"
echo "  rm .git/hooks/pre-commit"
echo ""
