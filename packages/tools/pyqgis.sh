#!/usr/bin/env sh
#
# Usage: ./pyqgis.sh extractAreas.py Gumyoji 'name' '弘明寺'
#

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
