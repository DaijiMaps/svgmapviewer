import type { ReactNode } from 'react'
import type { Book } from './types'

export function RenderBook(props: Readonly<Book>): ReactNode {
  return <p>{props.tag}</p>
}
