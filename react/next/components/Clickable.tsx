import React, { FC } from 'react'
import { Button } from '../typings/global'

/**
 * Defines a clickable area
 * @param props : Same props of button
 */
const Clickable: FC<Button> = props => {
  const { children, style, className, ...rest } = props

  return (
    <button
      className={`${className} absolute ma2 transparent flex items-center justify-center bn outline-0 pointer`}
      style={{
        background: 'transparent',
        ...style,
      }}
      {...rest}
    >
      {children}
    </button>
  )
}

export default Clickable
