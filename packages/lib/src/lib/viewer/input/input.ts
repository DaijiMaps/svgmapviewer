/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { notifyAction } from '../../event-action'

export function sendContextMenu(): void {
  notifyAction.recenter()
}
