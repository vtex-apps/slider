import React, { memo, FC } from 'react'
import result from 'lodash.result'

interface Props {
  currentSlide: number
  controls: string
  thumbnails?: {
    items: Array<{
      url: string
      forSlide: number
    }>
    classNames?: {
      thumbnails?: string
      thumbnail?: string
      selectedThumbnail?: string
    }
  }
  goToSlide: (index: number) => void
}

/**
 * Slider Tumbnails
 */
const Thumbnails: FC<Props> = props => {
  const { goToSlide, thumbnails, currentSlide, controls } = props

  const customClasses = {
    thumbnails: result(thumbnails!, 'classNames.thumbnails', ''),
    thumbnail: result(thumbnails!, 'classNames.thumbnail', ''),
    selectedThumbnail: result(thumbnails!, 'classNames.selectedThumbnail', ''),
  }

  const getThumbClass = (index: number) =>
    `${customClasses.thumbnail} ${
      currentSlide === index
        ? `${customClasses.selectedThumbnail} ba bw1 b--emphasis `
        : ''
    } pointer ma2`

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
      className={`${
        customClasses.thumbnails
      } flex flex-column w-20 justify-start pa0 ma0`}
      role="group"
      aria-label="Carousel Tumbnails"
    >
      {renderTumbnails()}
    </div>
  )
}

export default memo(Thumbnails)
