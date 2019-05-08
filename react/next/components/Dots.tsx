import React, { useMemo, memo, FC } from 'react'

interface Props {
  slidesToShow: number
  totalItems: number
  currentSlide: number
  domLoaded: boolean
  dotClass?: string
  dotListClass?: string
  slideVisibleSlides?: boolean
  goToSlide: (index: number) => void
}

/**
 * Returns the dot tha should be selected
 * @param slideVisibleSlides
 * @param currentSlide
 * @param slidesToShow
 */
const getSelectedDot = (
  slideVisibleSlides: boolean,
  currentSlide: number,
  slidesToShow: number
): number => {
  const realCurrentSlide = slideVisibleSlides
    ? currentSlide + (slidesToShow - 1)
    : currentSlide
  return slideVisibleSlides
    ? Math.floor(realCurrentSlide / slidesToShow)
    : realCurrentSlide
}

/**
 * Return the array of indices for the dots
 * The array will be empty if there are not any0 slidesToShow
 * If all the visible slides should pass on a dot click, the array elements will be the sequence from 0 to ceil(totalItems/slidesToShow)
 * If not, the array elements will be the sequence from 0 to totalSlides
 * @param slidesToShow
 * @param slideVisibleSlides
 * @param totalItems
 */
const getSlideIndices = (
  slidesToShow: number,
  slideVisibleSlides: boolean,
  totalItems: number
): Array<number> =>
  slidesToShow
    ? [
      ...Array(
        slideVisibleSlides ? Math.ceil(totalItems / slidesToShow) : totalItems
      ).keys(),
    ]
    : []

/**
 * Slider Dots
 */
const Dots: FC<Props> = props => {
  const { slidesToShow, totalItems, currentSlide, domLoaded, dotClass, dotListClass, slideVisibleSlides, goToSlide } = props

  const slideIndexes = getSlideIndices(slidesToShow, slideVisibleSlides!, totalItems)

  const handleDotClick = (index: number) => {
    const slideToGo = slideVisibleSlides ? index * slidesToShow : index

    const isLastDot = index === slideIndexes.length - 1
    const isExactDivision = totalItems % slidesToShow === 0
    const overslideThreshold =
      !isExactDivision && isLastDot ? Math.floor(totalItems / slidesToShow) : 0

    goToSlide(slideToGo - overslideThreshold)
  }

  const renderDots = () =>
    slideIndexes.map(index => {
      const isActive = index === getSelectedDot(slideVisibleSlides!, currentSlide, slidesToShow)
      return (
        <div
          className={`${dotClass} ${
            isActive ? 'bg-emphasis' : 'bg-muted-3'
            } grow dim dib w1 h1 br-100 pa2 mr2 bw0 pointer outline-0`}
          key={index}
          onClick={() => handleDotClick(index)}
        />
      )
    })

  return (
    <div
      className={`${dotListClass} flex absolute justify-center pa0 ma0 bottom-0 left-0 right-0`}
    >
      {renderDots()}
    </div>
  )
}

export default memo(Dots)
