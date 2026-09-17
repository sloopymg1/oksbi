#!/usr/bin/env bash
set -eu
curl -sS -i -X POST "http://localhost:7071/auth/logout" \
  -H "Authorization: Bearer <token>"
