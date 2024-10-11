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

nums = list(map(lambda x: '\'%s\'' % x, args))
exp = '"osm_id" IN (%s)' % (', '.join(nums))
#exp = '"osm_id" = \'200164093\'' # (%s)' % (', '.join(nums))
#exp = '"osm_id" IS NOT NULL'
#exp = '"osm_id" = \'200164093\''
print('exp', exp)

docdir = '/Users/uebayasi/Documents'
prjdir = '%s/Sources/DaijiMaps/QGIS' % docdir
datdir = '%s/Sources/DaijiMaps/daijimaps-data/%s' % (docdir, prefix)
prjdat = '%s/%s.qgz' % (prjdir, prefix)

areasGJ = '%s/areas.geojson' % datdir

####

import common

srcGJ = '%s/%s-%s.geojson' % (datdir, 'init', 'multilinestrings')
s = common.openVector(srcGJ, 'init-lines')
#d = common.extractFields(s, "MultiLineString", field, pattern)
d = common.filterMultiLineString(s, exp)
#d = common.mergeVectorLayers([d], 'memory:')
common.dumpGeoJSON(d, '%s/tmp-multilinestrings.geojson' % datdir)

common.exit()

exit()
