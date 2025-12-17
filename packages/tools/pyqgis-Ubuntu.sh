#!/usr/bin/env sh
#
# Usage: ./pyqgis.sh extractAreas.py Gumyoji 'name' '弘明寺'
#

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
