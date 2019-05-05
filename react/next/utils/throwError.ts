import { SliderProps } from '../types'

const throwError = (props: SliderProps): any => {
  const { ssr, responsive } = props

  if (!responsive) {
    throw new Error(
      ssr
        ? '⚠️ SSR mode need to be used in conjunction with responsive prop'
        : '️️️️⚠️ The responsive prop is when on SSR mode'
    )
  }

  if (responsive && typeof responsive !== 'object') {
    throw new Error('⚠️ The responsive prop must be an object')
  }
}

export default throwError
