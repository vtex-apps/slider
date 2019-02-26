export function resolveSlidesNumber(perPage) {
  let result
  if (typeof perPage === 'number') {
    result = perPage
  } else if (typeof perPage === 'object') {
    result = 1
    if (window) {
      for (const viewport in perPage) {
        if (window.innerWidth >= viewport) {
          result = perPage[viewport]
        }
      }
    }
  }
  return result
}

export function setStyle(target, styles) {
  Object.keys(styles).forEach(attr => {
    target.style[attr] = styles[attr]
  })
}

export function setTransformProperty(target, x = 0, y = 0, z = 0) {
  setStyle(target, {
    transform: `translate3d(${x}px, ${y}px, ${z}px)`,
    WebkitTransform: `translate3d(${x}px, ${y}px, ${z}px)`
  })
}

export function getStylingTransition(easing, duration = 0) {
  return {
    WebkitTransition: `all ${duration}ms ${easing}`,
    transition: `all ${duration}ms ${easing}`
  }
}

export const constants = {
  defaultResizeDebounce: 250,
  defaultTransitionDuration: 250
}
