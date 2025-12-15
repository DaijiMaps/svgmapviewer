/* eslint-disable functional/functional-parameters */
import { type ReactNode } from 'react'

export function Elevator(): ReactNode {
  return (
    <g id="XElevator" transform="translate(-36, -36)">
      <rect x="0.5" y="0.5" width="71" height="71" ry="6" stroke="white" />
      <g
        fill="none"
        stroke="white"
        strokeWidth="5"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="m 26.5,23.5 0,-17 M 20,14 26.5,6.5 33,14" />
        <path d="m 45.5,6.5 0,17 M 39,16 45.5,23.5 52,16" />
      </g>
      <rect
        x="17"
        y="28"
        width="38"
        height="38"
        ry="5"
        fill="white"
        stroke="none"
      />
      <rect x="22" y="33" width="28" height="28" stroke="none" />
      <g id="_person2" fill="white" stroke="none">
        <circle cx="27.5" cy="38.75" r="1.75" />
        <path d="m 24.5,41 a 1,1 0 0 0 -1,1 l 0,7 a 1,1 0 0 0 1,1 l 0.25,0 0,8.5 a 1.25,1.25 0 1 0 2.5,0 l 0,-8.5 0.5,0 0,8.5 a 1.25,1.25 0 1 0 2.5,0 l 0,-8.5 0.25,0 a 1,1 0 0 0 1,-1 l 0,-7 a 1,1 0 0 0 -1,-1 l -6,0 z" />
      </g>
      <use x="8.5" href="#_person2" />
      <use x="17" href="#_person2" />
    </g>
  )
}
