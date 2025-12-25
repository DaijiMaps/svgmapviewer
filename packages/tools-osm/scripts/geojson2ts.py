#! /usr/bin/env python3
#
# XXX node ts
#

import json
import os
import re

type_pat = re.compile('^(.*)<(.*)>$')

geojsons = {
    'areas': 'MultiPolygonGeoJSON',
    'internals': 'MultiPolygonGeoJSON',
    'origin': 'PointGeoJSON',
    'measures': 'LineGeoJSON<MeasureProperties>',
    'viewbox': 'LineGeoJSON',

    'map-points': 'OsmPointGeoJSON',
    'map-lines': 'OsmLineGeoJSON',
    'map-multilinestrings': 'OsmMultiLineStringGeoJSON',
    'map-multipolygons': 'OsmMultiPolygonGeoJSON',
}

def printObjectAsTs(o, ofile):
    if type(o) == str:
        ofile.write('"%s"\n' % o.replace('"', '\\"'))
    elif type(o) == int:
        ofile.write('%d\n' % o)
    elif type(o) == float:
        ofile.write('%f\n' % o)
    elif type(o) == type(None):
        ofile.write('null\n')
    elif type(o) == list:
        ofile.write('[\n')
        for (e) in o:
            printObjectAsTs(e, ofile)
            ofile.write(',\n')
        ofile.write(']\n')
    elif type(o) == dict:
        ofile.write('{\n')
        for k in o:
            ofile.write('%s: ' % k)
            printObjectAsTs(o[k], ofile)
            ofile.write(',\n')
        ofile.write('}\n')

for _geojson in geojsons:
    _name = _geojson.replace('map-', '')
    _type = geojsons[_geojson]
    try:
        with open('%s.json' % _geojson, 'r') as file:
            data = json.load(file)
            with open('%s.ts' % _geojson, 'w') as ofile:
                res = type_pat.match(_type)
                if res is None:
                    ofile.write('import { type %s } from "svgmapviewer/geo"\n' % _type)
                else:
                    ofile.write('import { type %s, type %s } from "svgmapviewer/geo"\n' % (res.group(1), res.group(2)))
                ofile.write('\n')
                ofile.write('export const %s: %s = \n' % (_name, _type))
                printObjectAsTs(data, ofile)
                ofile.write('\n')
                ofile.write('export default %s\n' % _name)

    except FileNotFound:
        print("%s.json not found" % _name)

# write all.ts
with open('all.ts', 'w') as ofile:
    for _geojson in geojsons:
        _name = _geojson.replace('map-', '')
        ofile.write('import %s from "./%s"\n' % (_name, _geojson))
    ofile.write('\n')
    ofile.write('export const mapData = {\n')
    for _geojson in geojsons:
        _name = _geojson.replace('map-', '')
        ofile.write('%s,\n' % (_name))
    ofile.write('}\n')
