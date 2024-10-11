import glob
import pathlib
import os
import os.path
import sys

import common

####

prefix = sys.argv[1]

pwd = os.getcwd()

osmFiles = glob.glob('%s/%s/map*.osm' % (pwd, prefix))

addrTmpl = 'A-1f-%s-%s-%d'

prjdir = '%s/%s' % (pwd, prefix)
datdir = prjdir
prjdat = '%s/map.qgz' % prjdir

# Templates
areasGJ = '%s/areas.geojson' % datdir
a1GJ = '%s/address1.geojson' % datdir
a2GJ = '%s/address2.geojson' % datdir
orgGJ = '%s/origin.geojson' % datdir

####

print('Creating project...', file = sys.stderr)
common.createPrj(prjdat)

def osm2gj(osm, layername):
    name = common.path2name(osm)
    return '%s/tmp-%s-%s.geojson' % (datdir, name, layername)

print('Expanding .osm layers...', file = sys.stderr)
for osm in osmFiles:
    name = common.path2name(osm)
    for (layername, _) in common.osmLayerNames:
        outGJ = osm2gj(osm, layername)
        print('Expanding %s:%s...' % (osm, layername), file = sys.stderr)
        common.expandOsm(osm, layername, name, outGJ)

print('Merging .geojson...', file = sys.stderr)
rects = {}
for (layername, typ) in common.osmLayerNames:
    olayers = list(map(lambda osm: osm2gj(osm, layername), osmFiles))
    out = common.mergeVectors(olayers, layername)
    rects[layername] = common.getBoundingBox(out)
    mapdat = '%s/%s-%s.geojson' % (datdir, 'map', layername)
    common.dumpGeoJSON(out, mapdat)

#rect = rects['multipolygons']
#common.createEmptyPolygonGeoJSON(areasGJ, rect)
#common.createEmptyPolygonGeoJSON(a1GJ, rect)
#common.createEmptyPolygonGeoJSON(a2GJ, rect)
#common.createEmptyMultiPointGeoJSON(orgGJ, rect)

# XXX add layers to project

common.exit()

exit()
