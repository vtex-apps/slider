import { useState, useEffect } from 'react'

/**
 * Hook that returns the hover state of a passed ref
 * @param ref React ref
 */
const useHovering = (ref: React.RefObject<HTMLDivElement>) => {
  const [isHovering, setHovering] = useState(false)

  const onMouseEnter = () => setHovering(true)
  const onMouseLeave = () => setHovering(false)

  useEffect(() => {
    if (ref && ref.current) {
      ref.current.addEventListener('mouseenter', onMouseEnter)
      ref.current.addEventListener('mouseleave', onMouseLeave)
    }

    return () => {
      if (ref && ref.current) {
        ref.current.removeEventListener('mouseenter', onMouseEnter)
        ref.current.removeEventListener('mouseleave', onMouseLeave)
      }
    }
  }, [])

  return { isHovering }
}

export default useHovering
