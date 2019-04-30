import { getWidthFromDeviceType, getItemClientSideWidth } from './elementWidth'
import { getInitialState, getIfSlideIsVisbile } from './common'
import throttle from './throttle'
import throwError from './throwError'
import { populateNextSlides } from './next'
import { populatePreviousSlides } from './previous'

export {
  getWidthFromDeviceType,
  getItemClientSideWidth,
  throttle,
  getInitialState,
  getIfSlideIsVisbile,
  throwError,
  populateNextSlides,
  populatePreviousSlides,
}
