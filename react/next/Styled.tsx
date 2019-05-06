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

interface ArrowProps
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  direction: 'left' | 'right'
}

export const StyledArrow: FC<ArrowProps> = props => {
  const { children, style, className, direction, ...rest } = props

  const directionStyle =
    direction === 'right'
      ? {
          right: 'calc(3% + 1px)',
        }
      : {
          left: 'calc(3% + 1px)',
        }

  return (
    <button
      className={`${className} absolute`}
      style={{
        border: 'none',
        outline: 'none',
        background: 'transparent',
        cursor: 'pointer',
        ...directionStyle,
        ...style!,
      }}
      {...rest}
    >
      {children}
    </button>
  )
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
