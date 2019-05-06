import React, {
  FC,
  DetailedHTMLProps,
  HTMLAttributes,
  ButtonHTMLAttributes,
} from 'react'

interface SlideProps
  extends DetailedHTMLProps<HTMLAttributes<HTMLDivElement>, HTMLDivElement> {
  shouldRenderOnSSR?: boolean
  domFullyLoaded?: boolean
  basis?: string | number
  width?: string | number
}

export const StyledSlide: FC<SlideProps> = props => {
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
