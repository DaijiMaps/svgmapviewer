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

# OUTPUT
originGJ = '%s/origin.geojson' % datdir

####

import common

common.openPrj(prjdir)

areas = common.openVector(areasGJ, "areas")

extent = common.getExtent(areas, 'memory:')
f = next(extent.getFeatures())
print(f)
print(f.attributes())

origin = common.getRoundedOrigin(extent)
print(origin)
print(origin.x())
print(origin.y())

# XXX save origin.geojson
res = common.createPointGeoJSON(originGJ, origin)
print(res)

common.exit()

exit()
