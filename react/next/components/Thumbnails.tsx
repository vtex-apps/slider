import React, { memo, FC } from 'react'
import csx from 'classnames'

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

  const selectedThumbClass = csx(
    classNames!.selectedThumbnail,
    'ba bw1 b--emphasis'
  )

  const getThumbClass = (index: number) =>
    csx(
      classNames!.thumbnail,
      'pointer ma2 h-auto w-90',
      currentSlide === index && selectedThumbClass
    )

  return (
    <div
      className={csx(classNames!.thumbnails, 'flex flex-column justify-start')}
      style={{
        width: thumbnails!.width,
      }}
      role="group"
      aria-label="Carousel Tumbnails"
    >
      {thumbnails &&
        thumbnails.items.map((item, i) => (
          <img
            src={item.url}
            key={item.forSlide}
            className={getThumbClass(item.forSlide)}
            onClick={() => goToSlide(item.forSlide)}
            role="button"
            ria-controls={controls}
            aria-label={`Thumbnail ${i + 1} of ${thumbnails.items!.length}`}
          />
        ))}
    </div>
  )
}

export default memo(Thumbnails)
