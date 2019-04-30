import { responsiveType } from '../types'

const getWidthFromDeviceType = (
  deviceType: string,
  responsive: responsiveType
): number | string | undefined =>
  responsive[deviceType] ? (100 / responsive[deviceType].items).toFixed(1) : 0

const getItemClientSideWidth = (
  slidesToShow: number,
  containerWidth: number
): number => Math.round(containerWidth / slidesToShow)

export { getWidthFromDeviceType, getItemClientSideWidth }
