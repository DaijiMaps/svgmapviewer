import {
  svgmapviewer,
  SvgMapViewerConfig,
  SvgMapViewerConfigUser,
} from './svgmapviewer'
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
import type { atrixH, MatrixMatrix, matrixV } from './lib/matrix/prefixed'
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

// svgmapviewer

export type { SvgMapViewerConfig, SvgMapViewerConfigUser }

export { svgmapviewer }

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

export type { atrixH, MatrixMatrix, matrixV }

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
