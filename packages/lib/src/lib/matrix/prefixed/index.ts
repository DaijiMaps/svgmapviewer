import { apply, applyF } from '../apply'
import { type Matrix, copy, empty, matrix, prod } from '../main'
import { multiply, multiplyF } from '../multiply'
import { rotate } from '../rotate'
import { scale, scaleAt } from '../scale'
import { toString } from '../toString'
import { translate } from '../translate'

export { type Matrix as MatrixMatrix }

export {
  apply as matrixApply,
  applyF as matrixApplyF,
  copy as matrixCopy,
  empty as matrixEmpty,
  matrix as matrixMatrix,
  multiply as matrixMultiply,
  multiplyF as matrixMultiplyF,
  prod as matrixProd,
  rotate as matrixRotate,
  scale as matrixScale,
  scaleAt as matrixScaleAt,
  toString as matrixToString,
  translate as matrixTranslate,
}
