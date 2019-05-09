import React, { FC } from 'react'
import { Div } from '../typings/global'

interface Props extends Div {
  width?: string | number
}

/**
 * Slide wrapper around each slider's children
 */
const Slide: FC<Props> = props => {
  const { width, style, className, children, ...rest } = props
  return (
    <div
      className={`${className} flex relative`}
      style={{
        width: `${width}px`,
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

export default Slide
