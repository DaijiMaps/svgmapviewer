import glob
import os
import sys

import common

####

common.createPrj()

areas = common.getAreas()
internals = common.getInternals()

areasLayers = common.readOsmByAreas(areas)
internalsLayers = common.readOsmByAreas(internals)

layernames = [
    x[0] for names in [common.osmLayerNames, common.extraLayerNames]
        for x in names
]

for layername in layernames:
    layers = internalsLayers if layername in { 'points', 'midpoints', 'centroids' } else areasLayers
    layer = common.fixupVectorLayer(layers[layername])
    gj = common.ctx.map_layerGJs[layername]
    common.dumpGeoJSON(layer, gj)

####

internalsLayers = None
areasLayers = None
internals = None
areas = None

common.exit()

exit()
