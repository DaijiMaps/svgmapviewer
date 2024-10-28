import decimal
import glob
import math
import os
import os.path
import pathlib
import re
import shutil
import sys
import typing

################################################################################

#### QGIS INITIALIZATION

from PyQt5.QtCore import *
from qgis.core import *
from qgis.gui import *

qgs = QgsApplication([], False)
qgs.initQgis()
freq = QgsFeatureRequest()
freq.setInvalidGeometryCheck(QgsFeatureRequest.GeometrySkipInvalid)

from plugins import processing
from processing.core.Processing import Processing
from processing.tools import dataobjects
from qgis.core import QgsFeatureRequest

Processing.initialize()

context = dataobjects.createContext()
context.setInvalidGeometryCheck(QgsFeatureRequest.GeometryNoCheck)

prj: QgsProject = None

################################################################################

#### COMMON FILES

def path2name(p) -> str:
    return pathlib.PurePath(os.path.basename(p)).stem

# QgsVectorLayer geometry type
# https://qgis.org/pyqgis/master/core/QgsVectorLayer.html
# memory data provider
# - “point”
# - “linestring”
# - “polygon”
# - “multipoint”
# - ”multilinestring”
# - ”multipolygon”
#type VectorGeometryType = typing.Literal['point', 'linestring', 'polygon', 'multipoint', 'multilinestring', 'multipolygon']

# layername -> QgsVectorLayer geometry type
# c.f. osmconf.ini
osmLayerNames = [
    ('points', 'point'),
    ('lines', 'linestring'),
    ('multipolygons', 'multipolygon'),
    ('multilinestrings', 'multilinestring'),
    #('other_relations', 'Polygon')
]

extraLayerNames = [
    ('midpoints', 'point'),
    ('centroids', 'point'),
]

# ./map*.osm
# ./map.qgz
# ./src/data/areas.geojson
# ./src/data/internals.geojson
# ./src/data/origin.geojson
# ./src/data/measures.geojson
# ./src/data/map-points.geojson
# ./src/data/map-lines.geojson
# ./src/data/map-multilinestrings.geojson
# ./src/data/map-multipolygons.geojson
# ./src/data/map-other_relations.geojson

class Context:
    prefix = ''
    prjdir = ''
    prj = ''
    srcdir = ''

    osmFiles = []

    areasGJ = ''
    areas_extentGJ = ''
    internalsGJ = ''
    internals_extentGJ = ''
    originGJ = ''
    measuresGJ = ''
    viewboxGJ = ''

    # points, lines, multilinestrings, multipolygons, other_relations
    map_layerGJs = {}

    def __init__(self):
        prjdir = os.getcwd()
        prefix = os.path.basename(prjdir)
        srcdir = '%s/src/data' % prjdir

        self.prefix = prefix
        self.prjdir = prjdir
        self.srcdir = srcdir

        self.prj = '%s/map.qgz' % prjdir

        # XXX osmFiles must NOT be []
        self.osmFiles = glob.glob('%s/map*.osm' % prjdir)

        self.areasGJ = '%s/areas.geojson' % srcdir
        self.areas_extentGJ = '%s/areas_extent.geojson' % srcdir
        self.internalsGJ = '%s/internals.geojson' % srcdir
        self.internals_extentGJ = '%s/internals_extent.geojson' % srcdir
        self.originGJ = '%s/origin.geojson' % srcdir
        self.measuresGJ = '%s/measures.geojson' % srcdir
        self.viewboxGJ = '%s/viewbox.geojson' % srcdir

        for (layername, _) in osmLayerNames:
            self.map_layerGJs[layername] = '%s/map-%s.geojson' % (srcdir, layername)
        for (layername, _) in extraLayerNames:
            self.map_layerGJs[layername] = '%s/map-%s.geojson' % (srcdir, layername)

    def jsonToGeoJson(self):
        for json in glob.glob('%s/*.json' % self.srcdir):
            (x, suffix) = os.path.splitext(json)
            geojson = '%s.geojson' % x
            if pathlib.Path(json).exists() and not pathlib.Path(geojson).exists():
                shutil.move(json, geojson)

    def geoJsonToJson(self):
        for geojson in glob.glob('%s/*.geojson' % self.srcdir):
            (x, suffix) = os.path.splitext(geojson)
            json = '%s.json' % x
            if pathlib.Path(geojson).exists() and not pathlib.Path(json).exists():
                shutil.move(geojson, json)

addrTmpl = 'A-1f-%s-%s-%d'

ctx = Context()
ctx.jsonToGeoJson()

################################################################################

def exit():
    global qgs
    qgs.exitQgis()
    del qgs

    ctx.geoJsonToJson()

    print('DONE!')

################################################################################

#### PROCESSING WRAPPERS

def mergeVectorLayers(layers: list[str], dst: QgsVectorLayer) -> QgsVectorLayer:
    p = {
        'CRS' : None,
        'LAYERS' : layers,
        'OUTPUT' : dst
    }
    print(p)
    return processing.run("qgis:mergevectorlayers", p, context = context)['OUTPUT']

def fixGeometries(src: QgsVectorLayer, dst: QgsVectorLayer) -> QgsVectorLayer:
    p = {
        'INPUT': src,
        'OUTPUT' : dst
    }
    return processing.run("qgis:fixgeometries", p, context = context)['OUTPUT']

def deleteColumn(src: QgsVectorLayer, dst: QgsVectorLayer, column) -> QgsVectorLayer:
    p = {
        'INPUT': src,
        'OUTPUT': dst,
        'COLUMN': column
    }
    return processing.run("qgis:deletecolumn", p, context = context)['OUTPUT']

def deleteDuplicateGeometries(src: QgsVectorLayer, dst: QgsVectorLayer) -> QgsVectorLayer:
    p = {
        'INPUT' : src,
        'OUTPUT' : dst
    }
    return processing.run("qgis:deleteduplicategeometries", p, context = context)['OUTPUT']

def selectByLocation(src: QgsVectorLayer, predicate: int, intersect: QgsVectorLayer = 0, method = 0) -> QgsVectorLayer:
    p = {
        'INPUT' : src,
        'PREDICATE' : predicate,
        'INTERSECT' : intersect,
        'METHOD' : method,
    }
    return processing.run("qgis:selectbylocation", p, context = context)['OUTPUT']

def joinAttributesByLocation(src: QgsVectorLayer, join, predicates: int, dst: QgsVectorLayer, method = 0, discard = False) -> QgsVectorLayer:
    # https://docs.qgis.org/testing/en/docs/user_manual/processing_algs/qgis/vectorgeneral.html#id58
    # PREDICATE:
    #   0 — intersects
    #   1 — contains
    #   2 — equals
    #   3 — touches
    #   4 — overlaps
    #   5 — within
    #   6 — crosses
    # METHOD:
    #   0 — one-to-many
    #   1 — one-to-one
    p = {
        'INPUT' : src,
        'JOIN' : join,
        'PREDICATE' : predicates, # within
        'JOIN_FIELDS' : [],
        'METHOD' : method, # 0:one-to-many, 1:one-to-one
        'DISCARD_NONMATCHING' : discard,
        'PREFIX' : '',
        'OUTPUT' : dst
    }
    return processing.run("qgis:joinattributesbylocation", p, context = context)['OUTPUT']

locationPredicates = [
    (0, 'intersects'),
    (1, 'contains'),
    (2, 'equals'),
    (3, 'touches'),
    (4, 'overlaps'),
    (5, 'within'),
    (6, 'crosses')
]

def centroids(src: QgsVectorLayer, dst: QgsVectorLayer) -> QgsVectorLayer:
    p = {
        'ALL_PARTS' : False,
        'INPUT' : src,
        'OUTPUT' : dst
    }
    return processing.run("qgis:centroids", p, context = context)['OUTPUT']

def getExtent(src: QgsVectorLayer, dst: QgsVectorLayer) -> QgsVectorLayer:
    p = {
        'INPUT': src,
        'OUTPUT': dst,
        'ROUND_TO': 0,
    }
    return processing.run("native:polygonfromlayerextent", p, context = context)['OUTPUT']

################################################################################

#### FILTER OPERATIONS

def filterPoint(l: QgsVectorLayer, exp: str) -> QgsVectorLayer:
    return filter(l, "point", exp)

def filterMultiPoint(l: QgsVectorLayer, exp: str) -> QgsVectorLayer:
    return filter(l, "multipoint", exp)

def filterLine(l: QgsVectorLayer, exp: str) -> QgsVectorLayer:
    return filter(l, "line", exp)

def filterMultiLineString(l: QgsVectorLayer, exp: str) -> QgsVectorLayer:
    return filter(l, "multilinestring", exp)

def filterPolygon(l: QgsVectorLayer, exp: str) -> QgsVectorLayer:
    return filter(l, "polygon", exp)

def filterMultiPolygon(l: QgsVectorLayer, exp: str) -> QgsVectorLayer:
    return filter(l, "multipolygon", exp)

def filter(l: QgsVectorLayer, typ: str, exp: str) -> QgsVectorLayer:
    fields = l.fields()

    m = makeVector(typ, "XXX")
    m.startEditing()
    md = m.dataProvider()
    md.addAttributes(fields)
    m.updateFields()

    l.selectByExpression(exp, Qgis.SelectBehavior.SetSelection) # SelectBehavior = SetSelection
    #print('l', len(l.selectedFeatures()))
    for f in l.selectedFeatures():
        m.addFeature(f)
    m.commitChanges()
    print("filter: exp: %s" % exp)
    print("filter: %d/%d" % (m.featureCount(), l.featureCount()))

    return m

################################################################################

#### OTHER OPERATIONS

def readOsmAll() -> dict[str, QgsVectorLayer]:
    selector: typing.Callable[[QgsVectorLayer], None] = lambda l: l.selectAll()
    return readOsm(selector)

def readOsmByAreas(areas: QgsVectorLayer) -> dict[str, QgsVectorLayer]:
    selector: typing.Callable[[QgsVectorLayer], None] = lambda l: selectByLocation(l, 0, areas, 0)
    return readOsm(selector)

def readOsm(selector: typing.Callable[[QgsVectorLayer], None]) -> dict[str, QgsVectorLayer]:
    allLayers: dict[str, list[QgsVectorLayer]] = {}
    mapLayers: dict[str, QgsVectorLayer] = {}

    for (layername, typ) in osmLayerNames:
        layers: list[QgsVectorLayer] = []
        for osm in ctx.osmFiles:
            uri = '%s|layername=%s' % (osm, layername)
            name = path2name(osm)
            l = openVector(uri, name)
            layers.append(l)
        allLayers[layername] = layers

    for (layername, typ) in osmLayerNames:
        layers = allLayers[layername]
        fields = layers[0].fields()

        # XXX prefix
        name = 'map-%s' % layername

        m = makeVector(typ, name)
        m.startEditing()
        md = m.dataProvider()
        md.addAttributes(fields)
        m.updateFields()

        for l in layers:
            selector(l)
            for f in l.selectedFeatures():
                m.addFeature(f)
        m.commitChanges()

        mapLayers[layername] = m

    mapLayers['midpoints'] = centroids(mapLayers['lines'], 'memory:')
    mapLayers['centroids'] = centroids(mapLayers['multipolygons'], 'memory:')

    return mapLayers

def expandOsm(osm: str, layername: str, name: str, outGeoJSON: str) -> tuple[QgsVectorFileWriter.WriterError, str, str, str]:
    uri = '%s|layername=%s' % (osm, layername)
    l = openVector(uri, name)
    print('layer', uri, l.featureCount())
    tx = l.transformContext()
    opts = QgsVectorFileWriter.SaveVectorOptions()
    opts.driverName = "GeoJSON"
    return QgsVectorFileWriter.writeAsVectorFormatV3(l, outGeoJSON, tx, opts)

def dumpGeoJSON(l: QgsVectorLayer, fn: str) -> tuple[QgsVectorFileWriter.WriterError, str, str, str]:
    tx = l.transformContext()
    opts = QgsVectorFileWriter.SaveVectorOptions()
    opts.driverName = "GeoJSON"
    return QgsVectorFileWriter.writeAsVectorFormatV3(l, fn, tx, opts)

def dumpCSV(l: QgsVectorLayer, fn: str) -> tuple[QgsVectorFileWriter.WriterError, str, str, str]:
    tx = l.transformContext()
    opts = QgsVectorFileWriter.SaveVectorOptions()
    opts.driverName = "CSV"
    opts.layerOptions = [
        "GEOMETRY=AS_WKT",
        "SEPARATOR=COMMA"
    ]
    return QgsVectorFileWriter.writeAsVectorFormatV3(l, fn, tx, opts)

# Merging multiple vectors
# Needed when the target area is large and covered by multiple map.osm
def mergeVectors(olayers, layername) -> QgsVectorLayer:
    out = mergeVectorLayers(olayers, 'memory:')
    # XXX GeoJSON needs fixgeometries
    out = fixGeometries(out, 'memory:')
    out = trimLayer(out)
    return deleteDuplicateGeometries(out, 'memory:')

def trimLayer(l: QgsVectorLayer) -> QgsVectorLayer:
    for c in ['layer', 'path']:
        l = deleteColumn(l, 'memory:', c)
    return l

def getBoundingBox(l: QgsVectorLayer) -> QgsRectangle:
    l.selectAll()
    return l.boundingBoxOfSelected()

def createEmptyPolygonGeoJSON(outGJ, rect: QgsRectangle):
    g = emptyPolygon(rect)
    return createEmptyGeoJSON(outGJ, "polygon", g)

def createEmptyLineGeoJSON(outGJ, rect: QgsRectangle):
    g = emptyLine(rect)
    return createEmptyGeoJSON(outGJ, "line", g)

def createEmptyMultiPointGeoJSON(outGJ, rect: QgsRectangle):
    g = emptyMultiPoint(rect)
    return createEmptyGeoJSON(outGJ, "multipoint", g)

def createEmptyPointGeoJSON(outGJ, rect: QgsRectangle):
    g = emptyPoint(rect)
    return createEmptyGeoJSON(outGJ, "point", g)

def emptyPoint(rect: QgsRectangle) -> QgsGeometry:
    (x1, y1, x2, y2) = rect2tuple(rect)
    x0 = (x1 + x2) / 2
    y0 = (y1 + y2) / 2
    p0 = QgsPointXY(x0, y0)
    return QgsGeometry.fromPointXY(p0)

def emptyMultiPoint(rect: QgsRectangle) -> QgsGeometry:
    (x1, y1, x2, y2) = rect2tuple(rect)
    x0 = (x1 + x2) / 2
    y0 = (y1 + y2) / 2
    p0 = QgsPointXY(x0, y0)
    mp = [p0]
    return QgsGeometry.fromMultiPointXY(mp)

def emptyLine(rect: QgsRectangle) -> QgsGeometry:
    (x1, y1, x2, y2) = rect2tuple(rect)
    p1 = QgsPointXY(x1, y1)
    p2 = QgsPointXY(x2, y2)
    pl = [p1, p2]
    mpl = [pl]
    return QgsGeometry.fromMultiPolylineXY(mpl)

# XXX Line vs. MultiLineString
# XXX Polygon vs. MultiPolygon

def emptyPolygon(rect: QgsRectangle) -> QgsGeometry:
    (x1, y1, x2, y2) = rect2tuple(rect)
    pl = [
        QgsPointXY(x1, y1),
        QgsPointXY(x2, y1),
        QgsPointXY(x2, y2),
        QgsPointXY(x1, y2)
    ]
    pg = [pl]
    mpg = [pg]
    return QgsGeometry.fromMultiPolygonXY(mpg)

def rect2tuple(rect: QgsRectangle) -> tuple[float, float, float, float]:
    return (rect.xMinimum(), rect.yMinimum(), rect.xMaximum(), rect.yMaximum())

def createEmptyGeoJSON(outGJ: str, typ: str, g: QgsGeometry) -> tuple[QgsVectorFileWriter.WriterError, str, str, str]:
    if os.path.exists(outGJ):
        return None

    m = createEmptyLayer(typ, g)

    tx = m.transformContext()
    opts = QgsVectorFileWriter.SaveVectorOptions()
    opts.driverName = "GeoJSON"
    return QgsVectorFileWriter.writeAsVectorFormatV3(m, outGJ, tx,opts)

def createEmptyLayer(typ: str, g: QgsGeometry) -> QgsVectorLayer:
    f = QgsFeature()
    f.setGeometry(g)
    l = makeVector(typ, "XXX")
    l.startEditing()
    l.addFeature(f)
    l.commitChanges()
    return l

def createPointGeoJSON(outGJ: str, p: QgsPoint) -> tuple[QgsVectorFileWriter.WriterError, str, str, str]:
    g = QgsGeometry.fromPoint(p)
    return createEmptyGeoJSON(outGJ, "point", g)

def createPrj():
    if os.path.exists(ctx.prj):
        return

    global prj
    prj = QgsProject.instance()
    # XXX Add known vector layers
    prj.write(ctx.prj)

def openPrj():
    if not os.path.exists(ctx.prj):
        return

    global prj
    prj = QgsProject.instance()
    prj.read(ctx.prj)

def classifyGeometries(l: QgsVectorLayer, areas: QgsVectorLayer) -> QgsVectorLayer:
    # - Classify each geometry in l by location
    # - Have 7 criteria (intersects, ..., crosses) represented as 0/1
    # - Append fields to l
    m = l
    for (p, pn) in locationPredicates:
        m = classifyGeometries1(m, areas, p, pn)
    # XXX l = packCriteria(l)
    return m

def classifyGeometries1(l: QgsVectorLayer, areas: QgsVectorLayer, predicate, predicateName: str) -> QgsVectorLayer:
    fields = QgsFields()
    fields.append(QgsField('areas_%s' % predicateName, QVariant.Int))

    m = makeVector("polygon", "XXX")
    m.startEditing()
    md = m.dataProvider()
    md.addAttributes(fields)
    m.updateFields()
    areas.selectAll()
    for f in areas.selectedFeatures():
        g = QgsFeature()
        g.setGeometry(f.geometry())
        g.setFields(fields)
        g['areas_%s' % predicateName] = 1
        m.addFeature(g)
    m.commitChanges()

    return joinAttributesByLocation(
        l,
        m,
        [predicate],
        'memory:',
        1
    )

def extractFields(l: QgsVectorLayer, typ: str, field: str, pattern: str) -> QgsVectorLayer:
    print('extractFields: field=%s pattern=%s' % (field, pattern))
    p = re.compile(pattern)
    m = makeVector(typ, "XXX")
    m.startEditing()
    l.selectAll()
    count = 0
    for f in l.selectedFeatures():
        v = f[field]
        if v == None or v == 'NULL':
            continue
        print("field: %s" % v)
        if p.match(str(v)) != None:
            print("extractFields: match!")
            count = count + 1
            g = QgsFeature()
            g.setGeometry(f.geometry())
            m.addFeature(g)
    m.commitChanges()
    print("%d features matched" % count)
    return m

def guessOrigin(l: QgsVectorLayer) -> typing.Union[QgsVectorLayer, None]:
    l.selectAll()
    for f in l.selectedFeatures():
        bb: QgsRectangle = f.geometry().boundingBox()
        oX = bb.xMinimum() - bb.width()
        oY = bb.yMinimum() - bb.height()
        p0 = QgsPointXY(oX, oY)
        mp = [p0]
        g = QgsGeometry.fromMultiPointXY(mp)
        return createEmptyLayer("point", g)
    return None

# Represent 'areas' information in one integer (0xef)
# To reduce .geojson size
def packCriteria(l: QgsVectorLayer, m: QgsVectorLayer) -> QgsVectorLayer:
    # Append 'areas'
    fields = QgsFields()
    fields.append(QgsField('areas', QVariant.Int))
    l.startEditing()
    ld = m.dataProvider()
    ld.addAttributes(fields)
    l.updateFields()
    l.selectAll()
    for f in l.selectedFeatures():
        v = 0
        for (i, n) in locationPredicates:
            v |= f[n] << i
        f['area'] = v
    l.commitChanges()

    # Trim 'areas_<predicateName>'
    idxs = []
    for (p, pn) in locationPredicates:
        idxs.append(l.fields.indexFromName('areas_%s' % pn))
    l.startEditing()
    ld = m.dataProvider()
    ld.deleteAttributes(idxs)
    l.updateFields()
    l.commitChanges()

    return l

def tagAddresses(al: QgsVectorLayer, fname: str, srcShp, dstShp) -> QgsVectorLayer:
    print("tagAddress: %d" % srcShp.featureCount())
    al.selectAll()

    fields = QgsFields()
    fields.append(QgsField(fname, QVariant.Int))

    m = makeVector("polygon", "XXX")
    m.startEditing()
    md = m.dataProvider()
    md.addAttributes(fields)
    m.updateFields()

    #olayers = list()
    for f in al.selectedFeatures():
        # Rename attribute field: id -> address1
        oid = f["id"] # Save
        f.setFields(fields)
        f[fname] = oid # Restore
        m.addFeature(f)

    m.commitChanges()

    # Get buildings within this address's area
    return joinAttributesByLocation(
        srcShp,
        m,
        [5], # [within]
        'memory:',
        1,
        True
    )
    #print("tagAddress: oid=%d: %d" % (oid, out.featureCount()))
    #olayers.append(out)
    #return mergeVectorLayers(olayers, dstShp)

def getAreas() -> QgsVectorLayer:
    gj = ctx.areasGJ
    return openVector('%s|geometrytype=MultiPolygon' % gj, "areas")

def getOrigin(gj: str) -> QgsPoint:
    l = openVector('%s|geometrytype=Point' % gj, "origin")
    f = next(l.getFeatures())
    p = f.geometry().asPoint()
    return p

def extentCenter(extent: QgsVectorLayer) -> QgsPoint:
    f = next(extent.getFeatures())
    ox = float(f['CNTX'])
    oy = float(f['CNTY'])
    return QgsPoint(ox, oy)

def getRoundedOrigin(extent: QgsVectorLayer) -> QgsPoint:
    p = extentCenter(extent)
    x = roundFloatToFracPrec(p.x(), 6)
    y = roundFloatToFracPrec(p.y(), 6)
    return QgsPoint(x, y)

def getViewbox():
    (gj, name) = (None, None)
    if os.path.exists(ctx.internals_extentGJ):
        (gj, name) = (ctx.internals_extentGJ, "internals_extent")
    else:
        (gj, name) = (ctx.areas_extentGJ, "areas_extent")
    extent = openVector('%s|geometrytype=Polygon' % gj, name)
    f = next(extent.getFeatures())
    minx = float(f['MINX'])
    miny = float(f['MINY'])
    maxx = float(f['MAXX'])
    maxy = float(f['MAXY'])
    p: QgsPoint = QgsPoint(minx, maxy)
    q: QgsPoint = QgsPoint(maxx, miny)

    o: QgsPoint = getOrigin(ctx.originGJ)

    lop = QgsGeometry.fromPolyline(QgsLineString([o, p]))
    lpq = QgsGeometry.fromPolyline(QgsLineString([p, q]))

    m = createMeasures()
    fields = m.fields()

    m.startEditing()
    for l in [lop, lpq]:
        f = QgsFeature()
        f.setGeometry(l)
        f.setFields(fields)
        m.addFeature(f)
    m.commitChanges()

    return m

# if fracprec = 3:
# 1.11111 -> 1.111
# 11.11111 -> 11.111
# 111.11111 -> 111.111
def roundFloatToFracPrec(n: float, fracprec: int) -> float:
    print('roundFloatToFracPrec n=%f fracprec=%f' % (n, fracprec))
    prec = round(math.log(abs(n), 10)) + 6
    print('roundFloatToFracPrec prec=%f' % prec)
    decimal.getcontext().prec = prec
    return float(decimal.Decimal(n) * decimal.Decimal(1))

def getMeasures(extent: QgsVectorLayer, origin: QgsVectorLayer) -> QgsVectorLayer:
    f = next(extent.getFeatures())
    maxx = float(f['MAXX'])
    miny = float(f['MINY'])

    f = next(origin.getFeatures())
    g = f.geometry()
    o = QgsPoint(g.asPoint())

    p = QgsPoint(maxx, o.y())
    q = QgsPoint(o.x(), miny)
    dp = o.distance(p.x(), p.y())
    dq = o.distance(q.x(), q.y())

    lp = QgsGeometry.fromPolyline(QgsLineString([o, p]))
    lq = QgsGeometry.fromPolyline(QgsLineString([o, q]))
    invx = -1 if (o.x() > p.x()) else 1
    invy = -1 if (o.y() < q.y()) else 1
    edp = calcEllipsoidalDistance(lp) * invx
    edq = calcEllipsoidalDistance(lq) * invy

    m = createMeasures()
    fields = m.fields()

    m.startEditing()
    for (dir, l, d, ed) in [('x', lp, dp, edp), ('y', lq, dq, edq)]:
        f = QgsFeature()
        f.setGeometry(l)
        f.setFields(fields)
        f['direction'] = dir
        f['distance'] = d
        f['ellipsoidal_distance'] = ed
        m.addFeature(f)
    m.commitChanges()

    return m

def createMeasures() -> QgsVectorLayer:
    fields = QgsFields()
    fields.append(QgsField('direction', QVariant.String))
    fields.append(QgsField('distance', QVariant.Double))
    fields.append(QgsField('ellipsoidal_distance', QVariant.Double))

    m = makeVector("linestring", "XXX")
    m.startEditing()
    md = m.dataProvider()
    md.addAttributes(fields)
    m.updateFields()
    m.commitChanges()

    return m

def createViewbox() -> QgsVectorLayer:
    fields = QgsFields()

    m = makeVector("linestring", "XXX")
    m.startEditing()
    md = m.dataProvider()
    md.addAttributes(fields)
    m.updateFields()
    m.commitChanges()

    return m

# XXX
# XXX refactor
# XXX
def fixupAttributes(prefix: str, l: QgsVectorLayer, outGeoJSON, origin: QgsPoint) -> tuple[QgsVectorFileWriter.WriterError, str, str, str]:
    addrTmpl = '%s-%%s-%%s-%%d' % prefix

    #fields = QgsFields()
    ofields: QgsFields = l.dataProvider().fields()
    fields: QgsFields = QgsFields(ofields)
    fields.append(QgsField('address1', QVariant.Double))
    fields.append(QgsField('address2', QVariant.Double))
    fields.append(QgsField('distance', QVariant.Double))
    fields.append(QgsField('rank', QVariant.Double))
    fields.append(QgsField('address', QVariant.String))

    m: QgsVectorLayer = makeVector("polygon", "XXX")
    m.startEditing()
    md: QgsVectorDataProvider = m.dataProvider()
    md.addAttributes(fields)
    m.updateFields()

    l.selectAll()

    # Create a dict: (address1, address2) => [(id, distance)]
    # Then order & number fields
    # For example, 5 A-1f-2-3 fields are numbered as A-1f-2-3-1, A-1f-2-3-2, ...
    print('Making addrs...')
    addrs = {}
    for f in l.selectedFeatures():
        v1 = f['address1']
        v2 = f['address2']
        # Distance between f.centroid() and origin
        d = f.geometry().centroid().asPoint().distance(origin.x(), origin.y())
        k = (v1, v2)
        v = (f.id(), d)
        if k not in addrs:
            addrs[k] = [v]
        else:
            addrs[k].append(v)

    print('Making ranks...')
    ranks = {}
    for _, ovs in addrs.items():
        # ov[0] == id
        # ov[1] == distance
        ovs.sort(key = lambda ov: ov[1])
        for i, ov in enumerate(ovs):
            ranks[ov[0]] = (i, ov[1])

    for f in l.selectedFeatures():
        v1 = f['address1']
        v2 = f['address2']
        (i, d) = ranks[f.id()]
        r = i + 1 # address starts from 1

        g = QgsFeature()
        g.setGeometry(f.geometry())
        g.setFields(fields)
        for i in ofields:
            fn = i.name()
            g[fn] = f[fn]
        g['address1'] = v1
        g['address2'] = v2
        g['distance'] = d
        g['rank'] = r
        g['address'] = addrTmpl % (v1, v2, r)
        m.addFeature(g)

    m.commitChanges()

    tx = m.transformContext()
    opts = QgsVectorFileWriter.SaveVectorOptions()
    opts.driverName = "GeoJSON"
    return QgsVectorFileWriter.writeAsVectorFormatV3(m, outGeoJSON, tx, opts)

def calcEllipsoidalDistance(g: QgsGeometry) -> float:
    d = QgsDistanceArea()
    d.setEllipsoid('WGS84')
    return d.measureLength(g)

def copyFeature(f: QgsFeature, fields: QgsFields) -> QgsFeature:
    g = QgsFeature()
    g.setGeometry(f.geometry())
    g.setFields(fields)
    for i in fields:
        fn = i.name()
        #print('fn', fn)
        g[fn] = f[fn]
    return g

def openVector(uri: str, name: str) -> QgsVectorLayer:
    return QgsVectorLayer(uri, name, "ogr")

# https://qgis.org/pyqgis/master/core/QgsVectorLayer.html
# memory data provider
# geometry type: “point”, “linestring”, “polygon”, “multipoint”, ”multilinestring”, ”multipolygon”
def makeVector(uri: str, name: str) -> QgsVectorLayer:
    return QgsVectorLayer(uri, name, "memory")

####

def makeExtent():
    areas = openVector(ctx.areasGJ, "areas")
    extent = getExtent(areas, 'memory:')
    res = dumpGeoJSON(extent, ctx.areas_extentGJ)
    print(res)

    if os.path.exists(ctx.internalsGJ):
        internals = openVector(ctx.internalsGJ, "internals")
        internals_extent = getExtent(internals, 'memory:')
        res = dumpGeoJSON(internals_extent, ctx.internals_extentGJ)
        print(res)

def makeOrigin():
    areas = openVector(ctx.areasGJ, "areas")
    extent = openVector(ctx.areas_extentGJ, "areas_extent")

    origin = getRoundedOrigin(extent)
    res = createPointGeoJSON(ctx.originGJ, origin)
    print(res)

def makeMeasures():
    areas = openVector(ctx.areasGJ, "areas")
    extent = openVector(ctx.areas_extentGJ, "areas_extent")
    origin = openVector(ctx.originGJ, "origin")

    measures = getMeasures(extent, origin)
    res = dumpGeoJSON(measures, ctx.measuresGJ)
    print(res)

def makeViewbox():
    #extent = openVector(ctx.areas_extentGJ, "areas_extent")
    #origin = openVector(ctx.originGJ, "origin")

    viewbox = getViewbox()
    res = dumpGeoJSON(viewbox, ctx.viewboxGJ)
    print(res)
