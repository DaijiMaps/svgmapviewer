#!/bin/sh

for f in packages/*/rstest.config.ts; do
  d=$( dirname $f )
  ( cd $d; pnpm test )
done