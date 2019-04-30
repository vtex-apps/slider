import { getWidthFromDeviceType } from './elementWidth'
import { SliderInternalState, SliderProps } from '../types'

function getInitialState(
  state: SliderInternalState,
  props: SliderProps
): {
  shouldRenderOnSSR: boolean
  flexBisis: number | string | undefined
  domFullyLoaded: boolean
} {
  const { domLoaded, slidesToShow, containerWidth, itemWidth } = state
  const { deviceType, responsive, ssr } = props
  let flexBisis: number | string | undefined
  const domFullyLoaded = Boolean(
    domLoaded && slidesToShow && containerWidth && itemWidth
  )
  if (ssr && deviceType && !domFullyLoaded) {
    flexBisis = getWidthFromDeviceType(deviceType, responsive)
  }
  const shouldRenderOnSSR = Boolean(
    ssr && deviceType && !domFullyLoaded && flexBisis
  )

  return {
    shouldRenderOnSSR,
    flexBisis,
    domFullyLoaded,
  }
}

function getIfSlideIsVisbile(
  index: number,
  state: SliderInternalState
): boolean {
  const { currentSlide, slidesToShow } = state
  return index >= currentSlide && index < currentSlide + slidesToShow
}

export { getInitialState, getIfSlideIsVisbile }
