import { responsiveType, SliderProps } from '../types'

function getWidthFromDeviceType(
  deviceType: string,
  responsive: responsiveType
): number | string | undefined {
  let itemWidth
  if (responsive[deviceType]) {
    const { items } = responsive[deviceType]
    itemWidth = (100 / items).toFixed(1)
  }
  return itemWidth
}

function getItemClientSideWidth(
  props: SliderProps,
  slidesToShow: number,
  containerWidth: number
): number {
  return Math.round(containerWidth / slidesToShow)
}

export { getWidthFromDeviceType, getItemClientSideWidth }
