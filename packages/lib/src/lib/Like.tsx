/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
import { type ReactNode } from 'react'
import { like, unlike, useLikes } from './like'
//import './Like.css'

export interface LikeProps {
  _id: number // osm_id or osm_way_id
}

export function Like(props: Readonly<LikeProps>): ReactNode {
  const { _id: id } = props
  const ids = useLikes()

  return ids.has(id) ? (
    <span className="like liked" onClick={() => unlike(id)}>
      ★
    </span>
  ) : (
    <span className="like not-liked" onClick={() => like(id)}>
      ☆
    </span>
  )
}

export const likeStyle = `
.liked {
  color: orange;
}

.not-liked {
  color: black;
}
`
