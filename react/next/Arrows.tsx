import React, { ReactElement, cloneElement } from 'react'

import { StyledLeftArrow, StyledRightArrow } from './Styled'
import { stateCallBack } from './types'

interface LeftArrowProps {
  customLeftArrow?: ReactElement<any> | null
  getState: () => stateCallBack
  previous: () => void
}

interface RightArrowProps {
  customRightArrow?: ReactElement<any> | null
  getState: () => stateCallBack
  next: () => void
}

const LeftArrow = ({
  customLeftArrow,
  getState,
  previous,
}: LeftArrowProps): ReactElement<any> =>
  customLeftArrow ? (
    cloneElement(customLeftArrow, {
      onClick: () => previous(),
      carouselState: getState(),
    })
  ) : (
    <StyledLeftArrow onClick={() => previous()} />
  )

const RightArrow = ({
  customRightArrow,
  next,
  getState,
}: RightArrowProps): ReactElement<any> =>
  customRightArrow ? (
    cloneElement(customRightArrow, {
      onClick: () => next(),
      carouselState: getState(),
    })
  ) : (
    <StyledRightArrow onClick={() => next()} />
  )

export { LeftArrow, RightArrow }
