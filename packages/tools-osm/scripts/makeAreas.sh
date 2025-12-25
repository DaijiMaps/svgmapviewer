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

exec ${tools}/pyqgis.sh ${tools}/makeAreas.py "$@"
