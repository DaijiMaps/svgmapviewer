#! /Applications/QGIS3.14.app/Contents/MacOS/bin/python

import pathlib
import os
import os.path
import sys

####

prefix = sys.argv[1]

addrTmpl = 'A-1f-%s-%s-%d'

prjdir = './%s' % prefix
datdir = './%s' % prefix
prjdat = '%s/map.qgz' % prjdir

areasGJ = '%s/areas.geojson' % datdir

####

# - Read areas.geojson
# - For each layer (init-<layer>.geojson):
#   - Classify geometries by common.classifyGeometries()
# - Then output to <prefix>-<layer>.geojson

import common

common.openPrj(prjdir)

areas = common.openVector(areasGJ, "areas")

for (layername, _) in common.osmLayerNames:
    srcGJ = '%s/%s-%s.geojson' % (datdir, 'init', layername)
    dstBase = '%s/%s-%s' % (datdir, prefix, layername)
    s = common.openVector(srcGJ, 'init-%s' % layername)
    d = common.classifyGeometries(s, areas)
    common.dumpGeoJSON(d, '%s.geojson' % dstBase)
    common.dumpCSV(d, '%s.csv' % dstBase)

# XXX Hoge/Hoge-multipolygons.geojson -> Hoge/Hoge-centroids.geojson
src = '%s/%s-%s.geojson' % (datdir, prefix, 'multipolygons')
dstBase = '%s/%s-%s' % (datdir, prefix, 'centroids')
d = common.centroids(src, 'memory:')
common.dumpGeoJSON(d, '%s.geojson' % dstBase)
common.dumpCSV(d, '%s.csv' % dstBase)

src = '%s/%s-%s.geojson' % (datdir, prefix, 'lines')
dstBase = '%s/%s-%s' % (datdir, prefix, 'midpoints')
d = common.centroids(src, 'memory:')
common.dumpGeoJSON(d, '%s.geojson' % dstBase)
common.dumpCSV(d, '%s.csv' % dstBase)

common.exit()

exit()
