export type Context = { fidx: number }

export type Init = { type: 'INIT' }
export type InitDone = { type: 'INIT.DONE' }

export type Req = Init
export type Res = InitDone
