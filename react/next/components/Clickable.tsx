import React, { FC, DetailedHTMLProps, ButtonHTMLAttributes } from 'react'

/**
 * Defines a clickable area
 * @param props : Same props of button
 */
const Clickable: FC<
  DetailedHTMLProps<ButtonHTMLAttributes<HTMLButtonElement>, HTMLButtonElement>
> = props => {
  const { children, style, className, ...rest } = props

  return (
    <button
      className={`${className} absolute ma2 transparent flex items-center justify-center bn outline-0 pointer`}
      style={{
        background: 'transparent',
        ...style,
      }}
      role="button"
      {...rest}
    >
      {children}
    </button>
  )
}

export default Clickable
