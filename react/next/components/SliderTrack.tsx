import React, { FC } from 'react'
import { transitionType } from '../typings/global'

interface Props {
  className?: string
  transform: number
  transition: transitionType
}

const SliderTrack: FC<Props> = ({
  children,
  className,
  transform,
  transition,
}) => (
  <div
    className={`${className} flex relative pa0 ma0`}
    style={{
      willChange: 'transform',
      transition: `transform ${transition.speed}ms ${transition.timing}`,
      transitionDelay: `${transition.delay}ms`,
      transform: `translate3d(${transform}px, 0, 0)`,
    }}
  >
    {children}
  </div>
)

export default SliderTrack
