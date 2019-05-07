import React, { FC } from 'react'
import { transitionType } from '../typings/global';

interface Props {
  className?: string
  transform: number
  shouldRenderOnSSR: boolean
  transition: transitionType
}

const SliderTrack: FC<Props> = ({
  children,
  className,
  transform,
  transition,
  shouldRenderOnSSR,
}) => (
    <div
      className={`${className} flex relative pa0 ma0`}
      style={{
        willChange: 'transform',
        transition: `transform ${transition.speed}ms ${transition.timing}`,
        transitionDelay: `${transition.delay}ms`,
        transform: `translate3d(${transform}px, 0, 0)`,
        overflow: shouldRenderOnSSR ? 'hidden' : 'unset',
      }}
    >
      {children}
    </div>
  )


export default SliderTrack
