import glob
import pathlib
import os
import os.path
import sys

import common

####

common.createPrj()

def osm2gj(osm, layername):
    name = common.path2name(osm)
    return '%s/tmp-%s-%s.geojson' % (common.ctx.prjdir, name, layername)

print('Expanding .osm layers...', file = sys.stderr)
for osm in common.osmFiles:
    name = common.path2name(osm)
    for (layername, _) in common.osmLayerNames:
        outGJ = osm2gj(osm, layername)
        print('Expanding %s:%s...' % (osm, layername), file = sys.stderr)
        common.expandOsm(osm, layername, name, outGJ)

print('Merging .geojson...', file = sys.stderr)
rects = {}
for (layername, typ) in common.osmLayerNames:
    olayers = list(map(lambda osm: osm2gj(osm, layername), common.osmFiles))
    out = common.mergeVectors(olayers, layername)
    rects[layername] = common.getBoundingBox(out)
    mapdat = '%s/%s-%s.geojson' % (common.ctx.prjdir, 'map', layername)
    common.dumpGeoJSON(out, mapdat)

#rect = rects['multipolygons']
#common.createEmptyPolygonGeoJSON(areasGJ, rect)
#common.createEmptyPolygonGeoJSON(a1GJ, rect)
#common.createEmptyPolygonGeoJSON(a2GJ, rect)
#common.createEmptyMultiPointGeoJSON(orgGJ, rect)

# XXX add layers to project

common.exit()

exit()
