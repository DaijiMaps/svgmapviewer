/* eslint-disable functional/functional-parameters */
/* eslint-disable functional/no-return-void */
import { type ReactNode } from 'react'
import { useLikes } from './main'
import type { ID } from './types'

export interface LikeProps {
  _id: ID // osm_id or osm_way_id
}

export function Like(props: Readonly<LikeProps>): ReactNode {
  const { _id: id } = props
  const { like, unlike, isLiked } = useLikes()

  return isLiked(id) ? (
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
