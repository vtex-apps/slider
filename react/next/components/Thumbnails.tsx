import React, { memo, FC } from 'react'

interface Props {
  currentSlide: number
  controls: string
  classNames?: {
    thumbnails?: string
    thumbnail?: string
    selectedThumbnail?: string
  }
  thumbnails?: {
    items: Array<{
      url: string
      forSlide: number
    }>
    width: string
  }
  goToSlide: (index: number) => void
}

/**
 * Slider Tumbnails
 */
const Thumbnails: FC<Props> = props => {
  const { goToSlide, thumbnails, currentSlide, controls, classNames } = props

  const getThumbClass = (index: number) =>
    `${classNames!.thumbnail} ${
      currentSlide === index
        ? `${classNames!.selectedThumbnail} ba bw1 b--emphasis `
        : ''
    } pointer ma2 h-auto w-90`

  const renderTumbnails = () => {
    const { items } = thumbnails!
    return items.map((item, i) => (
      <img
        src={item.url}
        key={item.forSlide}
        className={getThumbClass(item.forSlide)}
        onClick={() => goToSlide(item.forSlide)}
        role="button"
        ria-controls={controls}
        aria-label={`Thumbnail ${i + 1} of ${items!.length}`}
      />
    ))
  }

  return (
    <div
      className={`${classNames!.thumbnails} flex flex-column justify-start`}
      style={{
        width: thumbnails!.width,
      }}
      role="group"
      aria-label="Carousel Tumbnails"
    >
      {renderTumbnails()}
    </div>
  )
}

export default memo(Thumbnails)
