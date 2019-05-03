import { getWidthFromDeviceType } from './elementWidth'
import { SliderInternalState, SliderProps } from '../types'

interface InitalState {
  shouldRenderOnSSR: boolean
  flexBasis: number | string | undefined
  domFullyLoaded: boolean
}

const getInitialState = (
  state: SliderInternalState,
  props: SliderProps
): InitalState => {
  const { domLoaded, slidesToShow, containerWidth, itemWidth } = state
  const { deviceType, responsive, ssr } = props

  let flexBasis: number | string | undefined

  const domFullyLoaded = Boolean(
    domLoaded && slidesToShow && containerWidth && itemWidth
  )

  if (ssr && deviceType && !domFullyLoaded) {
    flexBasis = getWidthFromDeviceType(deviceType, responsive)
  }

  const shouldRenderOnSSR = Boolean(
    ssr && deviceType && !domFullyLoaded && flexBasis
  )

  return {
    shouldRenderOnSSR,
    flexBasis,
    domFullyLoaded,
  }
}

const getIfSlideIsVisbile = (
  index: number,
  state: SliderInternalState
): boolean => {
  const { currentSlide, slidesToShow } = state
  return index >= currentSlide && index < currentSlide + slidesToShow
}

export { getInitialState, getIfSlideIsVisbile }
