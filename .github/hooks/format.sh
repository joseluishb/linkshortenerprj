#!/usr/bin/env bash
INPUT=$(cat)
if echo "$INPUT" | grep -qE '"toolName"\s*:\s*"(create|edit)"'; then
  npx prettier --write .
fi
