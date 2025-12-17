#!/bin/sh

tools=$( cd $( dirname $0 ); pwd )

exec ${tools}/pyqgis.sh ${tools}/makeAreas.py "$@"
