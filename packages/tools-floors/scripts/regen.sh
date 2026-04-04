#!/bin/sh

scriptsdir=$( dirname $0 )
pkgdir=$( dirname $scriptsdir )

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
"$tools"/labels.sh ./src/data/map.svg > ./src/data/floors-labels.json
