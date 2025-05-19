/* eslint-disable functional/no-return-void */
import { useSelector } from '@xstate/store/react'
import { like, likesStore, unlike } from './lib/like'
import './Like.css'

export interface LikeProps {
  _id: number // osm_id or osm_way_id
}

export function Like(props: Readonly<LikeProps>) {
  const { _id: id } = props
  const ids = useSelector(likesStore, (s) => s.context.ids)

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
