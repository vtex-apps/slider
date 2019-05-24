import React, { memo, FC } from 'react'
import csx from 'classnames'

const DOTS_DEFAULT_SIZE = 0.625

interface Props {
  slidesToShow: number
  totalItems: number
  currentSlide: number
  domLoaded: boolean
  controls: string
  classNames?: {
    dotList?: string
    dot?: string
  }
  elements: {
    toPass?: number | 'visible'
  }
  goToSlide: (index: number) => void
}

/**
 * Returns the dot tha should be selected
 * @param passVisibleSlides
 * @param currentSlide
 * @param slidesToShow
 */
const getSelectedDot = (
  passVisibleSlides: boolean,
  currentSlide: number,
  slidesToShow: number
): number => {
  const realCurrentSlide = passVisibleSlides
    ? currentSlide + (slidesToShow - 1)
    : currentSlide
  return passVisibleSlides
    ? Math.floor(realCurrentSlide / slidesToShow)
    : realCurrentSlide
}

/**
 * Return the array of indices for the dots
 * The array will be empty if there are not any0 slidesToShow
 * If all the visible slides should pass on a dot click, the array elements will be the sequence from 0 to ceil(totalItems/slidesToShow)
 * If not, the array elements will be the sequence from 0 to totalSlides
 * @param slidesToShow
 * @param passVisibleSlides
 * @param totalItems
 */
const getSlideIndices = (
  slidesToShow: number,
  passVisibleSlides: boolean,
  totalItems: number
): Array<number> =>
  slidesToShow
    ? [
        ...Array(
          passVisibleSlides ? Math.ceil(totalItems / slidesToShow) : totalItems
        ).keys(),
      ]
    : []

/**
 * Slider Dots
 */
const Dots: FC<Props> = props => {
  const {
    slidesToShow,
    totalItems,
    currentSlide,
    classNames,
    elements,
    goToSlide,
    controls,
  } = props

  const passVisibleSlides = elements.toPass === 'visible'

  const slideIndexes = getSlideIndices(
    slidesToShow,
    passVisibleSlides,
    totalItems
  )

  const handleDotClick = (index: number) => {
    const slideToGo = passVisibleSlides ? index * slidesToShow : index

    const isLastDot = index === slideIndexes.length - 1
    const isExactDivision = totalItems % slidesToShow === 0
    const overslideThreshold =
      !isExactDivision && isLastDot ? Math.floor(totalItems / slidesToShow) : 0

    goToSlide(slideToGo - overslideThreshold)
  }

  const renderDots = () =>
    slideIndexes.map(index => {
      const isActive =
        index === getSelectedDot(passVisibleSlides, currentSlide, slidesToShow)
      return (
        <div
          className={csx(
            classNames!.dot,
            isActive ? 'bg-emphasis' : 'bg-muted-3',
            'grow dib br-100 pa2 mr2 ml2 bw0 pointer outline-0'
          )}
          style={{
            height: `${DOTS_DEFAULT_SIZE}rem`,
            width: `${DOTS_DEFAULT_SIZE}rem`,
          }}
          key={index}
          tabIndex={index}
          onKeyDown={() => handleDotClick(index)}
          onClick={() => handleDotClick(index)}
          role="button"
          aria-controls={controls}
          aria-label={`Dot ${index + 1} of ${slideIndexes.length}`}
        />
      )
    })

  return (
    <div
      className={`${
        classNames!.dotList
      } flex absolute justify-center pa0 ma0 bottom-0 left-0 right-0`}
      role="group"
      aria-label="Carousel Dots"
    >
      {renderDots()}
    </div>
  )
}

export default memo(Dots)
