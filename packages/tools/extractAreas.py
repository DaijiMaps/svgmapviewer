import pathlib
import os
import os.path
import subprocess
import sys

args = sys.argv
args.pop(0)

import common

common.openPrj()

####

mapLayers = common.readOsmAll()
s = mapLayers['multipolygons']

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

####

common.exit()

exit()
