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
