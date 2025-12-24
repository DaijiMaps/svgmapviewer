#!/bin/sh

args=$@

pkgdir=
if [ -n "$NODE_PATH" ]; then
  set -- $( echo $NODE_PATH | sed -e 's,:, ,g' )
  while :; do
    pkgdir=$( echo $1 | sed -e 's,/node_modules$,,' )
    [ -e $pkgdir/package.json ] && break
    [ $# -eq 0 ] && echo >&2 'package directory not found!' && exit 1
    shift
  done
else
  pkgdir=$( cd $( dirname $0 ); cd ..; pwd )
fi

set -- $args

####

tools="$pkgdir"/scripts

exec ${tools}/pyqgis.sh ${tools}/extractAreas.py "$@"
