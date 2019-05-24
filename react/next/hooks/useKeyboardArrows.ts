import { useEffect } from 'react'

//state.domLoaded, state.currentSlide
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
