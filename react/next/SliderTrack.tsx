import React, { FC, memo } from 'react'
import { useSpring, animated, config as springPresets } from 'react-spring'

interface Props {
  className?: string
  transform: number
}

const SliderTrack: FC<Props> = ({ children, className, transform }) => {
  const animationStyle =
    !!window.requestAnimationFrame &&
    useSpring({
      config: springPresets.default,
      transform: `translate3d(${transform}px, 0, 0)`,
    })

  return (
    <animated.div
      className={`${className} flex relative pa0 ma0`}
      style={animationStyle}
    >
      {children}
    </animated.div>
  )
}

export default SliderTrack
