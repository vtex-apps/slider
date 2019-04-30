import { SliderInternalState, SliderProps } from '../types'

function throwError(state: SliderInternalState, props: SliderProps): any {
  const { ssr, responsive } = props
  if (!responsive) {
    if (ssr) {
      throw new Error(
        'ssr mode need to be used in conjunction with responsive prop'
      )
    } else {
      throw new Error(
        'Responsive prop is needed for deciding the amount of items to show on the screen'
      )
    }
  }
  if (responsive && typeof responsive !== 'object') {
    throw new Error('responsive prop must be an object')
  }
}

export default throwError
