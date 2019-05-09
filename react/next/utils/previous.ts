interface NextSlides {
  nextSlides: number | undefined
  nextPosition: number | undefined
}

/**
 * Populate the previous slides
 * TODO: Implement the 'fake' translate when in infinite mode when left end is reached
 * @param currentSlide
 * @param slidesToShow
 * @param itemWidth
 * @param totalItems
 * @param slidesToSlide
 * @param slideVisibleSlides
 * @param infinite
 * @param slidesHavePassed
 */
const populatePreviousSlides = (
  currentSlide: number,
  slidesToShow: number,
  itemWidth: number,
  totalItems: number,
  slidesToSlide: number,
  slideVisibleSlides: boolean,
  infinite: boolean,
  slidesHavePassed: number = 0
): NextSlides => {
  let nextSlides
  let nextPosition

  const realPassedSlides =
    slidesHavePassed > 0
      ? 0
      : slideVisibleSlides
      ? slidesToShow
      : slidesToSlide!

  const nextMaximumSlides = currentSlide - slidesHavePassed - realPassedSlides

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
