/* eslint-disable functional/no-return-void */

export type Cb = () => void
export type Cbs = Set<Cb>

export type Cb1<T> = (args: T) => void
export type Cbs1<T> = Set<Cb1<T>>
