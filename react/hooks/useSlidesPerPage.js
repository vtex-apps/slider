import { useEffect, useState } from 'react'
import debounce from 'debounce'

import resolveSlidesNumber from '../utils/resolveSlidesNumber'

const useSlidesPerPage = (resizeDebounce, perPage) => {
  const [visibleSlides, setVisibleSlides] = useState(
    resolveSlidesNumber(perPage)
  )

  useEffect(() => {
    const handleResize = debounce(
      () => setVisibleSlides(resolveSlidesNumber(perPage)),
      resizeDebounce
    )
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return visibleSlides
}

export default useSlidesPerPage
