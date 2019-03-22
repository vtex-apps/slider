/**
 * This function returns the number of slides to show depending on the size of the window.
 * If you pass a number it just returns that number.
 * If you pass an object it will return the number of slides of the closest breakpoint to the size of the window.
 * If you pass of example
 * perPage = {
 *   400: 2,
 *   1000: 3  
 * }
 * 
 * If the size of the window is something between 400px and 999px if will return 2,
 * if it is 1000px or bigger, is will return 3 and if it is smaller than 400px it 
 * will return the default value that is 1.
 * @param {number|object} perPage 
 */
function resolveSlidesNumber(perPage) {
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

export default resolveSlidesNumber
