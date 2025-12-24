#!/usr/bin/env sh

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

QGIS_PREFIX_PATH="/Applications/QGIS-LTR.app/Contents/MacOS"

_bin="${QGIS_PREFIX_PATH}/bin"
_exe="${_bin}/python3.9"

PATH="${_bin}:${PATH}"

_p="${QGIS_PREFIX_PATH}/../Resources/python"
_p1=${_p}
_p2=${_p}/plugins
_p3=${_p}/plugins/processing
PYTHONPATH="${_p1}:${_p2}:${_p3}"

GDAL_DATA="${python}/../gdal"

exec env -i \
    PATH="${PATH}" \
    QGIS_PREFIX_PATH="${QGIS_PREFIX_PATH}" \
    PYTHONPATH="${PYTHONPATH}" \
    GDAL_DATA="${GDAL_DATA}" \
    ${_exe} $@
