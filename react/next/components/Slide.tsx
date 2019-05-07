import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react'

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  width?: string | number
}

/**
 * Slide wrapper around each slider's children
 */
const Slide: FC<Props> = props => {
  const {
    width,
    style,
    className,
    children,
    ...rest
  } = props
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
