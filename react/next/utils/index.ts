import { getWidthFromDeviceType, getItemClientSideWidth } from './elementWidth'
import { getInitialState, getIfSlideIsVisbile } from './common'
import { populateNextSlides } from './next'
import { populatePreviousSlides } from './previous'
import throwError from './throwError'

export {
  getWidthFromDeviceType,
  getItemClientSideWidth,
  getInitialState,
  getIfSlideIsVisbile,
  throwError,
  populateNextSlides,
  populatePreviousSlides,
}
