import glob
import os
import sys

import common

####

common.createPrj()

areas = common.getAreas()

mapLayers = common.readOsmByAreas(areas)

for (layername, _) in common.osmLayerNames:
    l = mapLayers[layername]
    gj = common.ctx.map_layerGJs[layername]
    common.dumpGeoJSON(l, gj)

centroids = common.centroids(mapLayers['multipolygons'], 'memory:')
gj = '%s/map-centroids.geojson' % common.ctx.srcdir
common.dumpGeoJSON(centroids, gj)

common.exit()

exit()
