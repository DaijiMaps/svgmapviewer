#!/bin/sh

scriptsdir=$( dirname $0 )
pkgdir=$( dirname $scriptsdir )

####

tools="$pkgdir"/scripts

export UV_PROJECT="$pkgdir"

. "$tools"/inkex-setup

#extensions="$pkgdir"/inkscape/extensions
extensions=$( inkscape --user-data-directory)/extensions

uv sync
uv run python "$extensions"/extract_labels.py ./src/data/map.svg > ./src/data/floors-labels.json
