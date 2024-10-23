import pathlib
import os
import os.path
import sys

import common

####

common.openPrj()

extent = common.openVector(common.ctx.areas_extentGJ, "areas_extent")
origin = common.openVector(common.ctx.originGJ, "origin")

viewbox = common.getViewbox()

res = common.dumpGeoJSON(viewbox, common.ctx.viewboxGJ)
print(res)

common.exit()

exit()
