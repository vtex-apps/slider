import React, { PureComponent } from 'react'
import PropTypes from 'prop-types'

export default function virtualize(MyComponent) {
  class Virtualize extends PureComponent {
    static propTypes = {
      children: (props, propName) => {
        if (props[propName] !== undefined) {
          return new Error("The children property isn't supported.")
        }
      },
      index: PropTypes.number.isRequired,
      onChangeIndex: PropTypes.func.isRequired,
      onTransitionEnd: PropTypes.func,
      overscanSlideAfter: PropTypes.number,
      overscanSlideBefore: PropTypes.number,
      slideCount: PropTypes.number,
      slideRenderer: PropTypes.func.isRequired
    }

    static defaultProps = {
      overscanSlideAfter: 2,
      overscanSlideBefore: 3,
      index: 0
    }

    static getDerivedStateFromProps(nextProps, prevState) {
      if (nextProps.index !== prevState.index) {
        const indexDiff = nextProps.index - prevState.index
        const result = Virtualize.getNextIndexState({
          index: nextProps.index,
          indexContainer: prevState.indexContainer + indexDiff,
          indexDiff,
          slideCount: nextProps.slideCount,
          indexStart: prevState.indexStart,
          indexStop: prevState.indexStop 
        })
        return result
      }

      return null
    }

    static getNextIndexState = ({
      index,
      indexContainer,
      indexDiff,
      slideCount,
      indexStart,
      indexStop
    }) => {
      const nextState = {
        index,
        indexContainer,
        indexStart: indexStart,
        indexStop: indexStop
      }

      if (indexDiff > 0 &&
        (!slideCount || nextState.indexStop < slideCount - 1)
      ) {
        nextState.indexStop++
      }

      if (index > nextState.indexStop) {
        nextState.indexStop = index
      }

      const beforeAhead = nextState.indexStart - index

      if (beforeAhead > 0) {
        nextState.indexContainer += beforeAhead
        nextState.indexStart -= beforeAhead
      }

      return nextState
    }

    constructor(props) {
      super(props)

      const windowParams = this.getWindow({
        index: props.index,
        slideCount: props.slideCount,
        beforeAhead: props.overscanSlideBefore,
        afterAhead: props.overscanSlideAfter
      })
      this.state = {
        index: props.index,
        ...windowParams
      }
      this.timer = null
    }

    getWindow = ({
      index,
      slideCount,
      beforeAhead,
      afterAhead,
    }) => {
      if (slideCount) {
        if (beforeAhead > index) {
          beforeAhead = index
        }
        
        if (afterAhead + index > slideCount - 1) {
          afterAhead = slideCount - index - 1
        }
      }

      return {
        indexContainer: beforeAhead,
        indexStart: index - beforeAhead,
        indexStop: index + afterAhead
      }
    }

    handleTransitionEnd = () => {
      this.timer = setTimeout(() => {
        this.setState(({ index }) => {
          const { slideCount, overscanSlideBefore, overscanSlideAfter } = this.props
          return this.getWindow({
            index,
            slideCount: slideCount,
            beforeAhead: overscanSlideBefore,
            afterAhead: overscanSlideAfter
          })
        })
      }, 0)
      
      if (this.props.onTransitionEnd) {
        this.props.onTransitionEnd()
      }
    }

    render() {
      const {
        children,
        index: indexProp,
        onTransitionEnd,
        overscanSlideAfter,
        overscanSlideBefore,
        slideCount,
        slideRenderer,
        ...other
      } = this.props

      const { indexContainer, indexStart, indexStop } = this.state
      console.log(indexStart, indexStop, indexContainer)
      const slides = []
      for (let slideIndex = indexStart; slideIndex <= indexStop; slideIndex++) {
        slides.push(
          slideRenderer({
            index: slideIndex,
            key: slideIndex
          })
        )
      }

      return (
        <MyComponent
          currentSlide={indexContainer}
          onTransitionEnd={this.handleTransitionEnd}
          {...other}
        >
          {slides}
        </MyComponent>
      )
    }
  }

  return Virtualize
}
