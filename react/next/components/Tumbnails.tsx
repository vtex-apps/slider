import React, { memo, FC } from 'react'

interface Props {
  slidesToShow: number
  totalItems: number
  currentSlide: number
  domLoaded: boolean
  controls: string
  goToSlide: (index: number) => void
}

/**
 * Slider Tumbnails
 */
const Tumbnails: FC<Props> = props => {
  const {
    slidesToShow,
    totalItems,
    currentSlide,
    goToSlide,
    controls,
  } = props


  const handleTumbnailClick = (index: number) => {
    goToSlide(index)
  }

  const renderTumbnails = () => {
    return (
      <div onClick={() => handleTumbnailClick(1)}>
        <p>Tumb</p>
      </div>
    )
  }

  return (
    <div
      className={`flex absolute justify-center pa0 ma0 bottom-0 left-0 right-0`}
      role="group"
      aria-label="Carousel Tumbnails"
    >
      {renderTumbnails()}
    </div>
  )
}

export default memo(Tumbnails)
