import React, { useMemo } from 'react'

import { SliderInternalState, SliderProps, stateCallBack } from './types'

interface DotsProps {
  props: SliderProps
  state: SliderInternalState
  goToSlide: (index: number) => void
  getState: () => stateCallBack
}

/**
 * Slider Dots
 */
const Dots = ({
  props,
  state,
  goToSlide,
  getState,
}: DotsProps): React.ReactElement<any> | null => {
  const { slidesToShow, totalItems, currentSlide, domLoaded } = state
  const { showDots, customDot, dotListClass, slideVisibleSlides } = props

  const slideIndexes = useMemo(
    () =>
      slidesToShow
        ? [
            ...Array(
              slideVisibleSlides
                ? Math.ceil(totalItems / slidesToShow)
                : totalItems
            ).keys(),
          ]
        : [],
    [slidesToShow]
  )

  const selectedDot = useMemo(() => {
    const realCurrentSlide = slideVisibleSlides
      ? currentSlide + (slidesToShow - 1)
      : currentSlide
    return slideVisibleSlides
      ? Math.floor(realCurrentSlide / slidesToShow)
      : realCurrentSlide
  }, [currentSlide, domLoaded])

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
      const isActive = index === selectedDot
      return (
        <div
          className={`${
            isActive ? 'bg-emphasis' : 'bg-muted-3'
          } grow dim dib w1 h1 br-100 pa2 mr2 bw0 pointer outline-0`}
          key={index}
          onClick={() => handleDotClick(index)}
        />
      )
    })

  return showDots ? (
    <div
      className={`${dotListClass} flex absolute justify-center pa0 ma0 bottom-0 left-0 right-0`}
    >
      {renderDots()}
    </div>
  ) : null
}

export default React.memo(Dots)
