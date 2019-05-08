import React, { memo, FC, ComponentType } from 'react'
import { IconCaret } from 'vtex.store-icons'

import Clickable from './Clickable'

interface Props {
  custom?: ComponentType<any>
  className?: string
  orientation: 'left' | 'right'
  action: () => void
}

const Arrow: FC<Props> = props => {
  const { custom, orientation, action, className } = props
  return (
    <Clickable
      className={`${className} ${
        orientation === 'left' ? 'left-1' : 'right-1'
      }`}
      onClick={() => action()}
    >
      {custom || <IconCaret size={25} orientation={orientation} thin />}
    </Clickable>
  )
}

export default memo(Arrow)