interface NextSlides {
  nextSlides: number | undefined
  nextPosition: number | undefined
}

/**
 * Populate the next slides
 * TODO: Implement the 'fake' translate when in infinite mode when right end is reached
 * @param state : slider current state
 * @param props : slider props
 * @param slidesHavePassed : slides that passed
 */
const populateNextSlides = (
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

  const nextMaximumSlides =
    currentSlide + 1 + slidesHavePassed + slidesToShow + realPassedSlides

  if (nextMaximumSlides <= totalItems) {
    /** Have more slides hidden on right */
    nextSlides = currentSlide + slidesHavePassed + realPassedSlides
    nextPosition = -(itemWidth * nextSlides)
  } else if (
    nextMaximumSlides > totalItems &&
    currentSlide !== totalItems - slidesToShow
  ) {
    /** Prevent overslide */
    nextSlides = totalItems - slidesToShow
    nextPosition = -(itemWidth * nextSlides)
  } else if (infinite) {
    /** if reach end go to first slide */
    nextSlides = 0
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

export { populateNextSlides }
