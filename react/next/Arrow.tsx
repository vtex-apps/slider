import React, { ReactElement, cloneElement, memo } from 'react'

import { StyledArrow } from './Styled'
import { StateCallBack } from './typings'

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
  ) : (
    <StyledArrow direction={direction} onClick={() => action()}>
      ⏳
    </StyledArrow>
  )

export default memo(Arrow)
