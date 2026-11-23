#!/bin/sh

set -e

branch=$(git branch --show-current)
if [ "$branch" != "chore/deps" ]; then
	echo >&2 'run this script only on chore/deps!'
	exit 0
fi

pnpm -r up --latest
pnpx prettier -w pnpm-lock.yaml
pnpm install --frozen-lockfile
git add pnpm-lock.yaml
