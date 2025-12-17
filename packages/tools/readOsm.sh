#!/bin/sh
../../tools/pyqgis.sh ../../tools/readOsm.py "$@"

(
cd src/data
../../../../tools/geojson2ts.py
)
