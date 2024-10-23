import pathlib
import os
import os.path
import sys

import common

####

common.openPrj()

areas = common.openVector(common.ctx.areasGJ, "areas")

extent = common.getExtent(areas, 'memory:')
f = next(extent.getFeatures())
print(f)
print(f.attributes())

origin = common.getRoundedOrigin(extent)
print(origin)
print(origin.x())
print(origin.y())

# XXX save origin.geojson
res = common.createPointGeoJSON(common.ctx.originGJ, origin)
print(res)

common.exit()

exit()
