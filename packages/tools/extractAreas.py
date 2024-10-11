import pathlib
import os
import os.path
import subprocess
import sys

####

prefix = sys.argv[1]

args = sys.argv
args.pop(0)
args.pop(0)

#field = sys.argv[2]
#pattern = sys.argv[3]

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

common.openPrj(prjdat)

srcGJ = '%s/%s-%s.geojson' % (datdir, 'init', 'multipolygons')
s = common.openVector(srcGJ, 'init-multipolygons')
olayers = []
while len(args) > 0:
    field = args[0]
    pattern = args[1]
    args.pop(0)
    args.pop(0)

    l = common.extractFields(s, "Polygon", field, pattern)
    olayers.append(l)

l = common.mergeVectorLayers(olayers, 'memory:')
common.dumpGeoJSON(l, '%s/areas.geojson' % datdir)
common.dumpGeoJSON(l, '%s/address1.geojson' % datdir)
common.dumpGeoJSON(l, '%s/address2.geojson' % datdir)
o = common.guessOrigin(l)
common.dumpGeoJSON(o, '%s/origin.geojson' % datdir)

# cp areas.geojson internal.geojson
subprocess.call(['cp', '%s/areas.geojson' % datdir, '%s/internal.geojson' % datdir])

# origin: bottom-right -> top-left -> x2

common.exit()

exit()
