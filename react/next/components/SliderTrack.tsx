import React, { FC } from 'react'
import { transitionType, Div } from '../typings/global'

interface Props extends Div {
  transform: number
  transition: transitionType
}

const SliderTrack: FC<Props> = ({
  children,
  style,
  className,
  transform,
  transition,
  ...rest
}) => (
  <div
    className={`${className} flex relative pa0 ma0`}
    style={{
      willChange: 'transform',
      transition: `transform ${transition.speed}ms ${transition.timing}`,
      transitionDelay: `${transition.delay}ms`,
      transform: `translate3d(${transform}px, 0, 0)`,
      ...style,
    }}
    aria-atomic="false"
    aria-live="polite"
    {...rest}
  >
    {children}
  </div>
)

export default SliderTrack
