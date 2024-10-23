# XXX - Run this just before .ved is processed
# XXX - Change input to 'buildings.geojson'
# XXX - Output to 'buildings-tagged.geojson'
# XXX   - Read 'buildings-tagged.geojson' from *.ved

import os
import sys

prefix = sys.argv[1]

prjdir = './%s' % prefix
datdir = './%s' % prefix
prjdat = '%s/map.qgz' % prjdir

mapdat = '%s/%s-multipolygons.geojson' % (datdir, prefix)

addrTmplPrefix = 'A-1f'

####

import common

a1src = '%s/address1.geojson' % datdir
a2src = '%s/address2.geojson' % datdir
orgsrc = '%s/origin.geojson' % datdir
alldst = "%s/all.geojson" % datdir

common.openPrj(prjdat)

src = common.openVector(mapdat, "multipolygons")
a1 = common.openVector(a1src, "address1")
a2 = common.openVector(a2src, "address2")
buildings = common.filterPolygon(src, '"building" IS NOT NULL')

print('Applying address1...')
out = common.tagAddresses(a1, 'address1', buildings, 'memory:')
out = common.trimLayer(out)
print("tagAddress: address1: %d" % out.featureCount())

print('Applying address2...')
out = common.tagAddresses(a2, 'address2', out, 'memory:')
out = common.trimLayer(out)
print("tagAddress: address2: %d" % out.featureCount())

merged = out
origin = common.getOrigin(orgsrc)
common.fixupAttributes(addrTmplPrefix, merged, alldst, origin)

common.exit()

exit()
