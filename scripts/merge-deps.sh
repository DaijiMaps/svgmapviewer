#!/bin/sh
set -e
pnpm install
pnpx prettier -w pnpm-lock.yaml
git add pnpm-lock.yaml