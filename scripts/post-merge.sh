#!/bin/bash
set -e

echo "Running post-merge setup..."

if [ -f "frontend/package.json" ]; then
  echo "Installing frontend dependencies..."
  cd frontend && npm install --prefer-offline 2>/dev/null || npm install
  cd ..
fi

if [ -f "backend/package.json" ]; then
  echo "Installing backend dependencies..."
  cd backend && npm install --prefer-offline 2>/dev/null || npm install
  cd ..
fi

echo "Post-merge setup complete."
