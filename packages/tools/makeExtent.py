import pathlib
import os
import os.path
import sys

prefix = sys.argv[1]

pwd = os.getcwd()

prjdir = '%s/%s' % (pwd, prefix)
datdir = prjdir
prjdat = '%s/map.qgz' % prjdir

# INPUT
areasGJ = '%s/areas.geojson' % datdir

# OUTPUT
areas_extentGJ = '%s/areas_extent.geojson' % datdir

####

import common

common.openPrj(prjdir)

areas = common.openVector(areasGJ, "areas")

extent = common.getExtent(areas, 'memory:')

res = common.dumpGeoJSON(extent, areas_extentGJ)
print(res)

common.exit()

exit()
