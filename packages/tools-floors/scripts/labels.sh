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

#extensions="$pkgdir"/inkscape/extensions
extensions=$( inkscape --user-data-directory)/extensions

uv sync
uv run python "$extensions"/extract_labels.py ./src/data/map.svg > ./src/data/floors-labels.json
