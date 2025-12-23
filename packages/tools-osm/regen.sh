#!/bin/sh

tools=$( cd $( dirname $0 ); pwd )

${tools}/getOsm.sh
${tools}/pyqgis.sh ${tools}/readOsm.py
