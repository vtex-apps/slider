import {
  getParitialVisibilityGutter,
  getWidthFromDeviceType,
} from './elementWidth'
import { CarouselInternalState, CarouselProps } from '../types'

function getInitialState(
  state: CarouselInternalState,
  props: CarouselProps
): {
  shouldRenderOnSSR: boolean
  flexBisis: number | string | undefined
  domFullyLoaded: boolean
  paritialVisibilityGutter: number | undefined
} {
  const { domLoaded, slidesToShow, containerWidth, itemWidth } = state
  const { deviceType, responsive, ssr, partialVisbile } = props
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
  const paritialVisibilityGutter = getParitialVisibilityGutter(
    responsive,
    partialVisbile,
    deviceType,
    state.deviceType
  )
  return {
    shouldRenderOnSSR,
    flexBisis,
    domFullyLoaded,
    paritialVisibilityGutter,
  }
}

function getIfSlideIsVisbile(
  index: number,
  state: CarouselInternalState
): boolean {
  const { currentSlide, slidesToShow } = state
  return index >= currentSlide && index < currentSlide + slidesToShow
}

function getTransformForCenterMode(
  state: CarouselInternalState,
  props: CarouselProps
) {
  if (state.currentSlide === 0 && !props.infinite) {
    return state.transform
  } else {
    return state.transform + state.itemWidth / 2
  }
}
function getTransformForPartialVsibile(
  state: CarouselInternalState,
  paritialVisibilityGutter: number = 0
) {
  return state.transform + state.currentSlide * paritialVisibilityGutter
}

export {
  getInitialState,
  getIfSlideIsVisbile,
  getTransformForCenterMode,
  getTransformForPartialVsibile,
}
