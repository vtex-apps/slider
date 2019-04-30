import {
  getParitialVisibilityGutter,
  getWidthFromDeviceType,
} from './elementWidth'
import { SliderInternalState, SliderProps } from '../types'

function getInitialState(
  state: SliderInternalState,
  props: SliderProps
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
  state: SliderInternalState
): boolean {
  const { currentSlide, slidesToShow } = state
  return index >= currentSlide && index < currentSlide + slidesToShow
}

function getTransformForCenterMode(
  state: SliderInternalState,
  props: SliderProps
) {
  if (state.currentSlide === 0 && !props.infinite) {
    return state.transform
  } else {
    return state.transform + state.itemWidth / 2
  }
}
function getTransformForPartialVsibile(
  state: SliderInternalState,
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
