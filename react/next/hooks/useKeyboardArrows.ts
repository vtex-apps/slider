import { useEffect } from 'react'

/**
 * Adds event listener to call passed functions by pressing the left or right arrows
 * @param onLeft Function that is called on left arrow key press
 * @param onRight Function that is called on arrow arrow key press
 * @param deps Dependencies
 */
const useKeyboardArrows = (
  onLeft: () => void,
  onRight: () => void,
  deps: Array<any>
) => {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      event.code === 'ArrowLeft' && onLeft()
      event.code === 'ArrowRight' && onRight()
    }

    window.addEventListener('keydown', onKeyDown)

    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, deps)
}

export default useKeyboardArrows
