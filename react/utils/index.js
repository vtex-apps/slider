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
