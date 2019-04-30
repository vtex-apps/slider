import styled from 'styled-components'

interface SliderTrackProps {
  transition: string
  shouldRenderOnSSR: boolean
  transform: number
}

interface SlideProps {
  flex: string
  width: string
  position: string
}

interface DotProps {
  isActive: boolean
}

export const StyledArrow = styled.button`
  position: absolute;
  outline: none;
  transition: all 0.5s;
  z-index: 1000;
  border: none;
  background: rgba(0, 0, 0, 0.2);
  min-width: 3rem;
  min-height: 3rem;
  cursor: pointer;

  :hover {
    background: rgba(0, 0, 0, 0.8);
  }

  ::before {
    color: #fff;
    display: block;
    text-align: center;
    z-index: 2;
    position: relative;
  }
`

export const StyledLeftArrow = styled(StyledArrow)`
  left: calc(3% + 1px);
  :before {
    content: '⏪';
  }
`

export const StyledRightArrow = styled(StyledArrow)`
  right: calc(3% + 1px);
  :before {
    content: '⏩';
  }
`

export const SliderList = styled.div`
  display: flex;
  align-items: center;
  overflow: hidden;
  position: relative;
`

export const SliderTrack = styled.ul<SliderTrackProps>`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: row;
  position: relative;
  will-change: transform;
  transition: ${props => props.transition};
  overflow: ${props => (props.shouldRenderOnSSR ? 'hidden' : 'unset')};
  transform: ${props => `translate3d(${props.transform}px,0,0)`};
  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    overflow: visible !important;
  }
`

export const StyledSlide = styled.li<SlideProps>`
  flex: ${props => props.flex};
  position: ${props => props.position};
  width: ${props => props.width};
  @media all and (-ms-high-contrast: none), (-ms-high-contrast: active) {
    flex-shrink: 0 !important;
  }
`

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
