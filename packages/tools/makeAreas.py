import glob
import os
import os.path
import sys

prefix = sys.argv[1]
args = sys.argv
args.pop(0)
args.pop(0)
#field = sys.argv[2]
#pattern = sys.argv[3]


pwd = os.getcwd()

prjdir = '%s/%s' % (pwd, prefix)
datdir = prjdir
prjdat = '%s/map.qgz' % prjdir

# INPUT

# OUTPUT
areasGJ = '%s/areas.geojson' % datdir

####

import common

common.openPrj(prjdir)

osmFiles = glob.glob('%s/map*.osm' % datdir)
print(osmFiles)

mapLayers = common.readOsmAll(osmFiles)
l = mapLayers['multipolygons']

l.selectAll()
#for f in l.selectedFeatures():
#    name = f['name']
#    if name != None and name != '' and name != 'NULL':
#        #print(f.id(), f['name'])
#        continue

olayers = []
while len(args) > 0:
    field = args[0]
    pattern = args[1]
    args.pop(0)
    args.pop(0)

    m = common.extractFields(l, "multipolygon", field, pattern)
    olayers.append(m)

m = common.mergeVectorLayers(olayers, 'memory:')
common.dumpGeoJSON(m, areasGJ)

common.exit()

exit()
