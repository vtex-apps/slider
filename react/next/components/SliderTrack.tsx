import React, { FC } from 'react'

interface Props {
  className?: string
  transform: number
  shouldRenderOnSSR: boolean
}

const SliderTrack: FC<Props> = ({
  children,
  className,
  transform,
  shouldRenderOnSSR,
}) => (
    <div
      className={`${className} flex relative pa0 ma0`}
      style={{
        willChange: 'transform',
        transition: 'transform 400ms ease-in-out',
        transform: `translate3d(${transform}px, 0, 0)`,
        overflow: shouldRenderOnSSR ? 'hidden' : 'unset',
      }}
    >
      {children}
    </div>
  )


export default SliderTrack
