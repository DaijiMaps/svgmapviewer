#!/bin/sh

tools=$( cd $( dirname $0 ); pwd )

${tools}/pyqgis.sh ${tools}/readOsm.py "$@"

(
cd src/data
${tools}/geojson2ts.py
${tools}/../../node_modules/.bin/prettier -w .
)
