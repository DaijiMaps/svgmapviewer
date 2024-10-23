import pathlib
import os
import os.path
import subprocess
import sys

args = sys.argv
args.pop(0)

import common

####

common.openPrj()

#srcGJ = common.ctx.map_layerGJs['multipolygons']
#print('GJ=%s' % srcGJ)
#s = common.openVector(srcGJ, 'map-multipolygons')

mapLayers = common.readOsmAll()
s = mapLayers['multipolygons']

print(s)
print(next(s.getFeatures()))

olayers = []
while len(args) > 0:
    field = args[0]
    pattern = args[1]
    args.pop(0)
    args.pop(0)

    l = common.extractFields(s, "polygon", field, pattern)
    olayers.append(l)

l = common.mergeVectorLayers(olayers, 'memory:')
common.dumpGeoJSON(l, common.ctx.areasGJ)

common.exit()

exit()
