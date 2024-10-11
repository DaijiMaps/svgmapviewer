import pathlib
import os
import os.path
import sys

prefix = sys.argv[1]

prjdir = './%s' % prefix
datdir = './%s' % prefix
prjdat = '%s/map.qgz' % prjdir

# INPUT
areasGJ = '%s/areas.geojson' % datdir
areas_extentGJ = '%s/areas_extent.geojson' % datdir
originGJ = '%s/origin.geojson' % datdir

# OUTPUT
measuresGJ = '%s/measures.geojson' % datdir

####

import common

common.openPrj(prjdir)

areas = common.openVector(areasGJ, "areas")

extent = common.getExtent(areas, 'memory:')

origin = common.openVector(originGJ, "origin")

measures = common.getMeasures(extent, origin)

res = common.dumpGeoJSON(measures, measuresGJ)
print(res)

common.exit()

exit()
