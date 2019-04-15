import React, { useMemo } from 'react'
import PropTypes from 'prop-types'
import classnames from 'classnames'

import useSlidesPerPage from '../hooks/useSlidesPerPage'
import { constants } from '../utils'
import styles from './styles.css'

const Dots = ({
  rootTag: RootTag,
  dotTag: DotTag,
  classes: classesProp,
  dotProps,
  showDotsPerPage,
  perPage,
  currentSlide,
  onChangeSlide,
  totalSlides,
  dotSize,
  resizeDebounce,
  loop,
  treePath,
  ...otherProps
}) => {
  const visibleSlides = useSlidesPerPage(resizeDebounce, perPage)

  const slideIndeces = useMemo(
    () =>
      visibleSlides
        ? [
            ...Array(
              showDotsPerPage
                ? Math.ceil(totalSlides / visibleSlides)
                : totalSlides
            ).keys(),
          ]
        : [],
    [visibleSlides]
  )

  const selectedDot = useMemo(() => {
    const realCurrentSlide = loop ? currentSlide - visibleSlides : currentSlide
    return showDotsPerPage
      ? Math.floor(realCurrentSlide / visibleSlides)
      : realCurrentSlide
  }, [currentSlide])

  const handleDotClick = index => {
    console.log('OnClick', visibleSlides)
    const slideToGo = showDotsPerPage ? index * visibleSlides : index
    onChangeSlide(loop ? slideToGo + visibleSlides : slideToGo)
    console.log('At end', visibleSlides)
  }

  const classes = {
    ...Dots.defaultProps.classes,
    ...classesProp,
  }

  return totalSlides >= 2 ? (
    <RootTag
      className={classnames(
        styles.dotsContainer,
        classes.root,
        'absolute ma0 pa0 dib list'
      )}
      {...otherProps}
    >
      {slideIndeces.map(i => {
        const dotClasses = classnames(classes.dot, 'dib', {
          [classes.activeDot]: i === selectedDot,
          [classes.notActiveDot]: i !== selectedDot,
        })
        return (
          <DotTag
            className={dotClasses}
            key={i}
            onClick={() => handleDotClick(i)}
            {...{ style: { height: dotSize, width: dotSize } }}
            {...dotProps}
          />
        )
      })}
    </RootTag>
  ) : null
}

Dots.propTypes = {
  /** Classes to style the elements fo the component */
  classes: PropTypes.shape({
    root: PropTypes.string,
    dot: PropTypes.string,
    activeDot: PropTypes.string,
    notActiveDot: PropTypes.string,
  }),
  /** Extra props to be applied to the dot element */
  dotProps: PropTypes.object,
  /** The size of the dots, can be a number (in this case it will use px unit), or a string (you have to pass the number with the unit e.g '3rem') */
  dotSize: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  /** Tag to be rendered in the dot element */
  dotTag: PropTypes.string,
  /** If the slides should be looping */
  loop: PropTypes.bool,
  /** Function to change the currentSlide */
  onChangeSlide: PropTypes.func.isRequired,
  /** This prop works the same way the perPage of Slider and this component should receive the same value of Slider */
  perPage: PropTypes.oneOfType([PropTypes.number, PropTypes.object]),
  /** Debounce time in milliseconds. */
  resizeDebounce: PropTypes.number,
  /** Tag of root element of the component to be rendered */
  rootTag: PropTypes.string,
  /** Total value of sliders that will be rendered */
  totalSlides: PropTypes.number.isRequired,
  /** If this flag is true, then every dot represent a page of slides (e.g. if perPage = 2 and you have 4 elements,
   * then you have 2 dots), if false, then it will render a dot to every slide */
  showDotsPerPage: PropTypes.bool,
}

Dots.defaultProps = {
  classes: {
    root: '',
    dot: '',
    activeDot: '',
    notActiveDot: '',
  },
  dotTag: 'li',
  loop: false,
  perPage: 1,
  rootTag: 'ul',
  showDotsPerPage: false,
  resizeDebounce: constants.defaultResizeDebounce,
}

export default Dots
