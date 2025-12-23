import pathlib
import os
import os.path
import sys

import common

####

common.openPrj()

areas = common.openVector(common.ctx.areasGJ, "areas")

extent = common.getExtent(areas, 'memory:')

res = common.dumpGeoJSON(extent, common.ctx.areas_extentGJ)
print(res)

common.exit()

exit()
