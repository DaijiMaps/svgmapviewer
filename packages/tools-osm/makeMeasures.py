import pathlib
import os
import os.path
import sys

import common

####

common.openPrj()

areas = common.openVector(common.ctx.areasGJ, "areas")

extent = common.getExtent(areas, 'memory:')

origin = common.openVector(common.ctx.originGJ, "origin")

measures = common.getMeasures(extent, origin)

res = common.dumpGeoJSON(measures, common.ctx.measuresGJ)
print(res)

common.exit()

exit()
