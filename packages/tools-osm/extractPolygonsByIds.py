#! /Applications/QGIS3.14.app/Contents/MacOS/bin/python

import pathlib
import os
import os.path
import sys

####

prefix = sys.argv[1]
field = sys.argv[2]
args = sys.argv
args.pop(0)
args.pop(0)
args.pop(0)

patterns = list(map(lambda x: '^%s$' % x, args))
pattern = '|'.join(patterns)
# pattern = '^123$|^456$'

docdir = '/Users/uebayasi/Documents'
prjdir = '%s/Sources/DaijiMaps/QGIS' % docdir
datdir = '%s/Sources/DaijiMaps/daijimaps-data/%s' % (docdir, prefix)
prjdat = '%s/%s.qgz' % (prjdir, prefix)

areasGJ = '%s/areas.geojson' % datdir

####

import common

srcGJ = '%s/%s-%s.geojson' % (datdir, 'init', 'multipolygons')
s = common.openVector(srcGJ, 'init-multipolygons')
d = common.extractFields(s, "Polygon", field, pattern)
#d = common.mergeVectorLayers([d], 'memory:')
common.dumpGeoJSON(d, '%s/tmp-polygons.geojson' % datdir)

# origin: bottom-right -> top-left -> x2

common.exit()

exit()
