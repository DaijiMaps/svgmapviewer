#!/bin/sh

pkgdir=
if [ -n "$NODE_PATH" ]; then
  paths=$NODE_PATH
  while :; do
    d=${paths%%/node_modules:*}
    paths=${paths#*:}
    [ -e "$d"/package.json ] && pkgdir="$d" && break
    [ "$d"/node_modules = "$paths" ] && echo >&2 'package directory not found!' && exit 1
  done
else
  pkgdir=$( cd $( dirname $0 ); cd ..; pwd )
fi

####

tools="$pkgdir"/scripts

export UV_PROJECT="$pkgdir"

. "$tools"/inkex-setup

extensions="$pkgdir"/inkscape/extensions

uv sync
uv run python ${tools}/regen.py
for f in ./src/assets/floor-*.svg; do
  echo "fixup $f..."
  cp $f $f.orig
  uv run python "$extensions"/fixup_floor_svg.py $f.orig >$f.tmp
  uv run inkscape -l $f.tmp -o $f
done
