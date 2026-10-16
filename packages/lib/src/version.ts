/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */

export function version(): void {
  console.group()
  console.log('Welcome to svgmapviewer!')
  console.log('Version:', process.env.VERSION)
  console.log('GitHub:', process.env.GITHUB)
  console.groupEnd()
}
