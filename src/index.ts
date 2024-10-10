import type { BoxBox, BoxTlBr } from './lib/box/prefixed'
import {
  boxBox,
  boxCenter,
  boxCopy,
  boxExpandAt,
  boxExpandAtCenter,
  boxExpandAtOff,
  boxExpandAtRatio,
  boxFromTlBr,
  boxMove,
  boxScale,
  boxScaleAt,
  boxScaleAtCenter,
  boxScaleAtOff,
  boxScaleAtRatio,
  boxToTlBr,
  boxToViewBox,
  boxTransform,
  boxUnit,
} from './lib/box/prefixed'
import {
  a,
  calcScale,
  l,
  Line,
  lineToPath,
  MultiLineString,
  multiLineStringToPath,
  MultiPolygon,
  multiPolygonToPath,
  Point,
  s,
} from './lib/map/geojson'
import type { matrixH, MatrixMatrix, matrixV } from './lib/matrix/prefixed'
import {
  matrixApply,
  matrixApplyF,
  matrixCopy,
  matrixEmpty,
  matrixMatrix,
  matrixMultiply,
  matrixMultiplyF,
  matrixProd,
  matrixRotate,
  matrixScale,
  matrixScaleAt,
  matrixToString,
  matrixTranslate,
} from './lib/matrix/prefixed'
import type { VecVec, VecVecs } from './lib/vec/prefixed'
import {
  vecAdd,
  vecAddF,
  vecAngle,
  vecAngleF,
  vecCompare,
  vecCopy,
  vecDist,
  vecDiv,
  vecDivF,
  vecInterpolate,
  vecInterpolateF,
  vecMidpoint,
  vecMin,
  vecMinF,
  vecMul,
  vecMulF,
  vecOne,
  vecOrd,
  vecQdist,
  vecScale,
  vecScaleF,
  vecSub,
  vecSubF,
  vecSum,
  vecVec,
  vecZero,
} from './lib/vec/prefixed'
import {
  svgmapviewer,
  svgMapViewerConfig,
  SvgMapViewerConfig,
  SvgMapViewerConfigUser,
} from './svgmapviewer'

// svgmapviewer

export type { SvgMapViewerConfig, SvgMapViewerConfigUser }

export { svgmapviewer, svgMapViewerConfig }

// vec

export type { VecVec, VecVecs }

export {
  vecAdd,
  vecAddF,
  vecAngle,
  vecAngleF,
  vecCompare,
  vecCopy,
  vecDist,
  vecDiv,
  vecDivF,
  vecInterpolate,
  vecInterpolateF,
  vecMidpoint,
  vecMin,
  vecMinF,
  vecMul,
  vecMulF,
  vecOne,
  vecOrd,
  vecQdist,
  vecScale,
  vecScaleF,
  vecSub,
  vecSubF,
  vecSum,
  vecVec,
  vecZero,
}

// matrix

export type { matrixH, MatrixMatrix, matrixV }

export {
  matrixApply,
  matrixApplyF,
  matrixCopy,
  matrixEmpty,
  matrixMatrix,
  matrixMultiply,
  matrixMultiplyF,
  matrixProd,
  matrixRotate,
  matrixScale,
  matrixScaleAt,
  matrixToString,
  matrixTranslate,
}

// box

export type { BoxBox, BoxTlBr }

export {
  boxBox,
  boxCenter,
  boxCopy,
  boxExpandAt,
  boxExpandAtCenter,
  boxExpandAtOff,
  boxExpandAtRatio,
  boxFromTlBr,
  boxMove,
  boxScale,
  boxScaleAt,
  boxScaleAtCenter,
  boxScaleAtOff,
  boxScaleAtRatio,
  boxToTlBr,
  boxToViewBox,
  boxTransform,
  boxUnit,
}

// map/geojson

export type { Line, MultiLineString, MultiPolygon, Point }

export {
  a,
  calcScale,
  l,
  lineToPath,
  multiLineStringToPath,
  multiPolygonToPath,
  s,
}
