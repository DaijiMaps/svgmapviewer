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

proc() {
  rm src/*.*
  cp ../${src}/src/*.* src
  : cp ../${src}/vite.* .
  : cp ../${src}/package.json .
  : pnpm install
  #: ../../tools/regen.sh
  pnpm build
}

src=$1 # Expo2025

if [ ! -d ${src} ]; then
  echo >&2 "${src} is not a directory"
  exit 1
fi
if [ ! -e ${src}/map.osm ]; then
  echo >&2 "${src}/map.osm does not exist?"
  exit 1
fi

dirs=$( ls -1 */map.osm )

for f in ${dirs}; do
  d=${f%%/map.osm}
  name=${d##*/}
  if [ "$name" = "$src" ]; then
    continue
  fi
  pushd $d >/dev/null
  echo $name
  proc
  popd >/dev/null
done
