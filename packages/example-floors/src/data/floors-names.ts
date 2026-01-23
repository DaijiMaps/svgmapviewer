import { namesJsonToNames } from 'svgmapviewer/address'

import namesJson from './names.json' with { type: 'json' }

export const names = namesJsonToNames(namesJson)
