#!/usr/bin/env bash
set -eu
curl -sS -i "http://localhost:7071/auth/me" \
  -H "Authorization: Bearer <token>"
