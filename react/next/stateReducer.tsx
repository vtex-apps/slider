import { SliderInternalState } from './typings'

type Action =
  | { type: 'load'; payload: { slidesToShow: number; deviceType: string } }
  | {
      type: 'loadAndCorrect'
      payload: {
        slidesToShow: number
        deviceType: string
        containerWidth: number
        itemWidth: number
        shouldCorrectItemPosition: boolean
      }
    }
  | {
      type: 'slide'
      payload: {
        transform: number
        currentSlide: number
      }
    }

const reducer = (state: SliderInternalState, action: Action) => {
  switch (action.type) {
    case 'load':
      return {
        ...state,
        domLoaded: true,
        ...action.payload,
      }
    case 'loadAndCorrect':
      return {
        ...state,
        domLoaded: true,
        slidesToShow: action.payload.slidesToShow,
        deviceType: action.payload.deviceType,
        containerWidth: action.payload.containerWidth,
        itemWidth: action.payload.itemWidth,
        transform: action.payload.shouldCorrectItemPosition
          ? -action.payload.itemWidth * state.currentSlide
          : state.transform,
      }
    case 'slide':
      return {
        ...state,
        ...action.payload,
      }
    default:
      return state
  }
}

export default reducer
