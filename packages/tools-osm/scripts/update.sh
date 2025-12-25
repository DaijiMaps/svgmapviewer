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
