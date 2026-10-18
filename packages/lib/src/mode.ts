/* eslint-disable functional/no-return-void */
/* eslint-disable functional/no-expression-statements */
/* eslint-disable functional/functional-parameters */
export function openInfo(): void {
  openMode('info')
}

export function openSettings(): void {
  openMode('settings')
}

export function openGame(): void {
  openMode('game')
}

function openMode(mode: string): void {
  const url = document.location.href + `?mode=${mode}`
  window.open(url, mode)
}
