#!/usr/bin/env sh
#
# Usage: ./pyqgis.sh extractAreas.py Gumyoji 'name' '弘明寺'
#

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

_exe="/usr/bin/python3"

_p="/usr/share/qgis/python"
_p1=${_p}
_p2=${_p}/plugins
_p3=${_p}/plugins/processing
PYTHONPATH="${_p1}:${_p2}:${_p3}"

dir=${0%/*}

exec env \
    PYTHONPATH="${PYTHONPATH}" \
    OSM_CONFIG_FILE="${dir}/osmconf.ini" \
    ${_exe} $@
