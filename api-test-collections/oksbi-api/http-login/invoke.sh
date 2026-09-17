#!/usr/bin/env bash
set -eu
curl -sS -i -X POST "http://localhost:7071/auth/login" \
  -H "Content-Type: application/json" \
  -d '{"email":"debug-user@example.com","password":"Passw0rd!"}'
