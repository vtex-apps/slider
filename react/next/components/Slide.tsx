import React, { FC, DetailedHTMLProps, HTMLAttributes } from 'react'

interface Props
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  shouldRenderOnSSR?: boolean
  domFullyLoaded?: boolean
  basis?: string | number
  width?: string | number
}

/**
 * Slide wrapper around each slider's children
 */
const Slide: FC<Props> = props => {
  const {
    shouldRenderOnSSR,
    basis,
    domFullyLoaded,
    width,
    style,
    className,
    children,
    ...rest
  } = props
  return (
    <div
      className={`${className} relative`}
      style={{
        flex: shouldRenderOnSSR ? `1 0 ${basis}%` : 'auto',
        width: domFullyLoaded ? `${width}px` : 'auto',
        ...style,
      }}
      {...rest}
    >
      {children}
    </div>
  )
}

export default Slide