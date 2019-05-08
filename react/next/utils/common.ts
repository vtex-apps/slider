import { getWidthFromDeviceType } from './elementWidth'
import { SliderState, SliderProps } from '../typings/global'

interface InitalState {
  shouldRenderOnSSR: boolean
  flexBasis: number | string | undefined
  domFullyLoaded: boolean
}

/**
 * Gets the slider initial state
 * Stil needs some improvements
 * Will be useful to display skeletons
 */
const getInitialState = (
  state: SliderState,
  props: SliderProps
): InitalState => {
  const { domLoaded, slidesToShow, containerWidth, itemWidth } = state
  const { deviceType, ssr } = props

  const domFullyLoaded = Boolean(
    domLoaded && slidesToShow && containerWidth && itemWidth
  )

  const flexBasis =
    ssr && deviceType && !domFullyLoaded
      ? getWidthFromDeviceType(deviceType, ssr)
      : undefined

  const shouldRenderOnSSR = Boolean(
    ssr && deviceType && !domFullyLoaded && flexBasis
  )

  return {
    shouldRenderOnSSR,
    flexBasis,
    domFullyLoaded,
  }
}

/**
 * Returns if the slide is visible or not
 */
const getIfSlideIsVisbile = (index: number, currentSlide: number, slidesToShow: number): boolean => {
  return index >= currentSlide && index < currentSlide + slidesToShow
}

export { getInitialState, getIfSlideIsVisbile }
