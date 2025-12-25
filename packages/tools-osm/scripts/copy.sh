#!/usr/bin/env sh

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

orig=$1
shift
dirs=$@

for d in ${dirs}; do
  cd ${orig}
  mkdir -p ../${d}/src/data
  cp *.html *.json *.ts ../${d}
  cp src/*.* ../${d}/src
  cd $OLDPWD
  cd ${d}
    pnpm install
    ${tools}/getOsm.sh
    ${tools}/makeAreas.sh
    ${tools}/readOsm.sh
  cd $OLDPWD
done
