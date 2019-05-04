import styled from 'styled-components'

interface SliderTrackProps {
  transition: string
  shouldRenderOnSSR: boolean
  transform: number
}

interface SlideProps {
  shouldRenderOnSSR?: boolean
  domFullyLoaded?: boolean
  basis?: string | number
  width?: string | number
}

interface DotProps {
  isActive: boolean
}

export const StyledArrow = styled('button')`
  position: absolute;
  border: none;
  outline: none;
  background: transparent;
  cursor: pointer;
  :before {
    content: '';
    display: block;
    position: relative;
    text-align: center;
    width: 2rem;
    height: 2rem;
    border-top: solid 0.15rem currentColor;
    border-right: solid 0.15rem currentColor;
  }
`

export const StyledLeftArrow = styled(StyledArrow)`
  left: calc(3% + 1px);
  :before {
    transform: rotate(225deg);
  }
`

export const StyledRightArrow = styled(StyledArrow)`
  right: calc(3% + 1px);
  :before {
    transform: rotate(45deg);
  }
`

export const SliderTrack = styled('div')<SliderTrackProps>(
  {
    willChange: 'transform',
  },
  props => ({
    transition: props.transition,
    overflow: props.shouldRenderOnSSR ? 'hidden' : 'unset',
    transform: `translate3d(${props.transform}px,0,0)`,
  })
)

export const StyledSlide = styled('div')<SlideProps>(props => ({
  flex: props.shouldRenderOnSSR ? `1 0 ${props.basis}%` : 'auto',
  width: props.domFullyLoaded ? `${props.width}px` : 'auto',
}))
