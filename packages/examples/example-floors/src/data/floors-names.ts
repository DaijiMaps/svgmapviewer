import { namesJsonToNames, type Names } from 'svgmapviewer/address'

import namesJson from './names.json' with { type: 'json' }

export const names: Names = namesJsonToNames(namesJson)
