/* eslint-disable functional/no-return-void */
import { type ReactNode } from 'react'
import { like, unlike, useLikes } from './lib/like'
import './Like.css'

export interface LikeProps {
  _id: number // osm_id or osm_way_id
}

export function Like(props: Readonly<LikeProps>): ReactNode {
  const { _id: id } = props
  const ids = useLikes()

  return ids.has(id) ? (
    <span className="liked" onClick={() => unlike(id)}>
      ★
    </span>
  ) : (
    <span className="not-liked" onClick={() => like(id)}>
      ☆
    </span>
  )
}
