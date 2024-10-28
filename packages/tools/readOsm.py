import glob
import os
import sys

import common

####

common.createPrj()

areas = common.getAreas()

mapLayers = common.readOsmByAreas(areas)

layernames = [
    x[0] for names in [common.osmLayerNames, common.extraLayerNames]
        for x in names
]

for layername in layernames:
    l = mapLayers[layername]
    gj = common.ctx.map_layerGJs[layername]
    common.dumpGeoJSON(l, gj)

####

mapLayers = None
areas = None

common.exit()

exit()
