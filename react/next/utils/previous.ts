import { SliderInternalState, SliderProps } from '../types'

interface NextSlides {
  nextSlides: number | undefined
  nextPosition: number | undefined
}

/**
 * Populate the previous slides
 * TODO: Implement the 'fake' translate when in infinite mode when left end is reached
 * @param state : slider current state
 * @param props : slider props
 * @param slidesHavePassed : slides that passed
 */
const populatePreviousSlides = (
  state: SliderInternalState,
  props: SliderProps,
  slidesHavePassed: number = 0
): NextSlides => {
  const { currentSlide, slidesToShow, itemWidth, totalItems } = state
  const { slidesToSlide, slideVisibleSlides, infinite } = props

  let nextSlides
  let nextPosition

  const nextMaximumSlides =
    currentSlide -
    slidesHavePassed -
    (slidesHavePassed > 0
      ? 0
      : slideVisibleSlides
      ? slidesToShow
      : slidesToSlide!)

  if (nextMaximumSlides >= 0) {
    /** Have more slides hidden on left */
    nextSlides = nextMaximumSlides
    nextPosition = -(itemWidth * nextSlides)
  } else if (nextMaximumSlides < 0 && currentSlide !== 0) {
    /** Prevent overslide */
    nextSlides = 0
    nextPosition = 0
  } else if (infinite) {
    /** If reach start, go to last slide */
    nextSlides = totalItems - slidesToShow
    nextPosition = -(itemWidth * nextSlides)
  } else {
    nextSlides = undefined
    nextPosition = undefined
  }

  return {
    nextSlides,
    nextPosition,
  }
}

export { populatePreviousSlides }
