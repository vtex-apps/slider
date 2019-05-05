import React, { ReactElement, cloneElement } from 'react'

import { StyledLeftArrow, StyledRightArrow } from './Styled'
import { stateCallBack } from './types'

interface Props {
  custom?: ReactElement<any> | null
  direction: 'left' | 'right'
  getState: () => stateCallBack
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

export default Arrow
