/* eslint-disable functional/no-return-void */
import { useLikes } from './lib/like'
import './Like.css'

export interface LikeProps {
  _id: number // osm_id or osm_way_id
}

export function Like(props: Readonly<LikeProps>) {
  const { _id: id } = props
  const likes = useLikes()

  return likes.isLiked(id) ? (
    <span className="liked" onClick={() => likes.unlike(id)}>
      ★
    </span>
  ) : (
    <span className="not-liked" onClick={() => likes.like(id)}>
      ☆
    </span>
  )
}
