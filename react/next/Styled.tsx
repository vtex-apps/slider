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

export const StyledDotList = styled.ul`
  position: absolute;
  bottom: 0;
  display: flex;
  left: 0;
  right: 0;
  justify-content: center;
  margin: auto;
  padding: 0;
  margin: 0;
  list-style: none;
  text-align: center;
`

export const StyledDot = styled.button<DotProps>`
  display: inline-block;
  background: ${props => (props.isActive ? '#080808' : '#cecece')};
  width: 12px;
  height: 12px;
  border-radius: 50%;
  opacity: 1;
  padding: 5px 5px 5px 5px;
  box-shadow: none;
  transition: background 0.5s;
  border-width: 2px;
  border-style: solid;
  border-color: grey;
  padding: 0;
  margin: 0;
  margin-right: 6px;
  outline: 0;
  cursor: pointer;
  :hover {
    background: #080808;
  }
`
