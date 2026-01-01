/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
import { notifyActionRecenter } from '../../event-action'

export function sendContextMenu(): void {
  notifyActionRecenter()
}
