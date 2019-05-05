import React, { ReactElement, cloneElement, memo } from 'react'

import { StyledLeftArrow, StyledRightArrow } from './Styled'
import { StateCallBack } from './types'

interface Props {
  custom?: ReactElement<any> | null
  direction: 'left' | 'right'
  getState: StateCallBack
  action: () => void
}

const Arrow = ({
  custom,
  direction,
  getState,
  action,
}: Props): ReactElement<any> =>
  custom ? (
    cloneElement(custom, {
      onClick: () => action(),
      getState: getState,
      action: action,
    })
  ) : direction === 'left' ? (
    <StyledLeftArrow onClick={() => action()} />
  ) : (
    <StyledRightArrow onClick={() => action()} />
  )

export default memo(Arrow)
