import styles from './styles'
import debounce from 'debounce'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import React, { Component } from 'react'
import { resolveSlidesNumber } from '../utils'
import EventListener from 'react-event-listener'

class Dots extends Component {
  static propTypes = {
    classes: PropTypes.shape({
      root: PropTypes.string,
      dot: PropTypes.string,
      activeDot: PropTypes.string,
      notActiveDot: PropTypes.string
    }),
    dotProps: PropTypes.object,
    dotTag: PropTypes.string,
    onChangeSlide: PropTypes.func.isRequired,
    perPage: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
    rootTag: PropTypes.string,
    totalSlides: PropTypes.number.isRequired,
    showDotsPerPage: PropTypes.bool,
  }

  static defaultProps = {
    classes: {
      root: '',
      dot: '',
      activeDot: '',
      notActiveDot: ''
    },
    dotTag: 'li',
    perPage: 1,
    rootTag: 'ul',
    showDotsPerPage: false
  }

  constructor(props) {
    super(props)

    this.handleResize = debounce(() => {
      setTimeout(this._setPerPageOnResize, props.resizeDebounce)
    }, props.resizeDebounce)
  }

  get slideIndeces() {
    const { showDotsPerPage, totalSlides } = this.props

    if (this.perPage) {
      return [...Array(showDotsPerPage ? Math.ceil(totalSlides / this.perPage) : totalSlides).keys()]
    }

    return []
  }

  get selectedDot() {
    const { showDotsPerPage, currentSlide, totalSlides } = this.props

    let realCurrentSlide = currentSlide
    // this thing verifies if currentSlide is a negative clone
    if (currentSlide < 0) {
      realCurrentSlide += totalSlides
    }
    return showDotsPerPage ? Math.floor(realCurrentSlide / this.perPage) : realCurrentSlide
  }

  handleDotClick = index => {
    const { showDotsPerPage, onChangeSlide } = this.props

    let slideToGo
    if (showDotsPerPage) {
      slideToGo = index * this.perPage
    } else {
      slideToGo = index
    }
    onChangeSlide(slideToGo)
  }

  componentWillUnmount() {
    this.handleResize.clear()
  }

  _setPerPageOnResize = () => {
    const { perPage } = this.props
    this.perPage = resolveSlidesNumber(perPage)
    this.forceUpdate()
  }

  render() {
    const {
      rootTag: RootTag,
      dotTag: DotTag,
      classes: classesProp,
      dotProps,
      showDotsPerPage,
      perPage,
      currentSlide,
      onChangeSlide,
      totalSlides,
      ...otherProps
    } = this.props

    const classes = {
      ...Dots.defaultProps.classes,
      ...classesProp
    }

    if (!this.perPage) {
      this.perPage = resolveSlidesNumber(perPage)
    }

    return (
      <RootTag
        className={classnames(styles.dotsContainer, classes.root, 'absolute ma0 pa0 dib list')}
        {...otherProps}
      >
        <EventListener target="window" onResize={this.handleResize} />
        {this.slideIndeces.map(i => {
          const dotClasses = classnames(styles.dot, classes.dot, 'dib', {
            [classes.activeDot]: i === this.selectedDot,
            [classes.notActiveDot]: i !== this.selectedDot
          })
          return (
            <DotTag className={dotClasses} key={i} onClick={() => this.handleDotClick(i)} {...dotProps} />
          )
        })}
      </RootTag>
    )
  }
}

export default Dots
