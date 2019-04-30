import styled from 'styled-components'

export const StyledArrow = styled.button`
  position: absolute;
  outline: none;
  transition: all 0.5s;
  border-radius: 35px;
  z-index: 1000;
  border: none;
  background: rgba(0, 0, 0, 0.5);
  min-width: 43px;
  min-height: 43px;
  opacity: 1;
  cursor: pointer;
  :hover {
    background: rgba(0, 0, 0, 0.8);
  }
  ::before {
    font-size: 20px;
    color: #fff;
    display: block;
    font-family: Arial, Helvetica, sans-serif;
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

export const SliderTrack = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: row;
  position: relative;
  will-change: transform;
`
