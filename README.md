# VTEX Slider

## Description

The VTEX Slider is a slider that aims a good support for SSR and can display one or more slides per page.

:loudspeaker: **Disclaimer:** Don't fork this project; use, contribute, or open issue with your feature request

## Table of Contents
- [Usage](#usage)
  - [Configuration](#configuration)
    - [Slider](#slider)
    - [Slide](#slide)
    - [SliderContainer](#slidercontainer)
    - [Dots](#dots)
  - [Styles API](#styles-api)
    - [CSS namespaces](#css-namespaces)
- [Tests](#tests)

## Usage

To import it you can add to you `manifest.json` the following:

```json
{
  "dependencies": {
    "vtex.slider": "0.x"
  }
}
```

And then in your component you can import the components exported from the slider:

```javascript
import { Slider, Slide } from 'vtex.slider'
```

You can use it in your code like a React component with the jsx tags:

```javascript

handleChangeSlide = i => {
  this.setState({ currentSlide: i })
}

render() {
  const { currentSlide } = this.state
  // ...

  const { myProducts } = this.props

  return (
    <Slider currentSlide={currentSlide} onChangeSlide={this.handleChangeSlide}>
      {myProducts.map(product => (
        <Slide key={product.id}>
          <DisplayProductComponent product={product} />
        </Slide>
      ))}
    </Slider>
  )
}

```

If you want to show multiple items in the same page at the same time you can use the prop `perPage`:

```javascript
render() {
  const { currentSlide } = this.state
  const { myProducts } = this.props

  // The keys of the object represent the size of the window in px.
  // In this case if the window is 1300px large or bigger it will show 5 items,
  // If it has 900px or any size until 1299px it will show 4 items
  const perPage = {
    1300: 5,
    900: 4,
    700: 2,
    600: 1,
  }

  return (
    <Slider
      currentSlide={currentSlide}
      onChangeSlide={this.handleChangeSlide}
      perPage={perPage}
    >
      {myProducts.map(product => (
        <Slide key={product.id}>
          <DisplayProductComponent product={product} />
        </Slide>
      ))}
    </Slider>
  )
}
```

Bellow is an example with all the components together:

```javascript
arrowRender = ({ orientation, onClick }) => {
  return (
    <div className="arrow-container-class" onClick={onClick}>
      <MyArrowComponent orientation={orientation} />
    </div>
  )
}

arrowContainerRender = ({ children }) => {
  return (
    <MyContainerComponent>
      {children}
    </MyContainerComponent>
  )
}

render() {
  const { currentSlide } = this.state
  const { myProducts } = this.props

  const perPage = {
    1300: 5,
    1100: 4,
    900: 3,
    700: 2,
    300: 1
  }

  return (
    <SliderContainer className="mw9">
      <Slider
        loop
        easing="ease"
        duration={500}
        perPage={perPage}
        currentSlide={currentSlide}
        arrowRender={this.arrowRender}
        onChangeSlide={this.handleChangeSlide}
        arrowsContainerComponent={this.arrowContainerRender}
      >
        {myProducts.map(product => (
          <Slide
            className="slide-css-class"
            sliderTransitionDuration={500}
            key={product.id}
            defaultWidth={280}
          >
            <ProductComponent product={product} />
          </Slide>
        ))}
      </Slider>
      <Dots
        loop
        showDotsPerPage
        perPage={this.perPage}
        currentSlide={currentSlide}
        totalSlides={myProducts.length}
        onChangeSlide={this.handleChangeSlide}
        classes={{
          root: 'pv4',
          notActiveDot: 'bg-muted-3',
          dot: 'dot pointer br-100',
          activeDot: 'bg-emphasis'
        }}
      />
    </SliderContainer>
  )
}
```

### Configuration

#### Slider

| Prop name | Type | isRequired | defaultValue | Description |
| --- | --- | --- | --- | -- |
| `arrowRender` | `func` | :no_entry_sign: | :no_entry_sign: | A render function that will receive as props an orientation prop and an onClick callback |
| `arrowsContainerComponent` | `func/string` | :no_entry_sign: | :no_entry_sign: | The component used to contain both arrows. Either a string to use a DOM element or a component |
| `children` | `element/array` | :heavy_check_mark: | :no_entry_sign: | The slides to render |
| `classes` | `object` | :no_entry_sign: | No extra classes applied to any element | Classes to apply to the Slider elements |
| `currentSlide` | `number` | :no_entry_sign: | `0` | Current slide on the screen, if you have perPage > 1, then the current slide is the most left slide on the screen (You should not use this variable to display the index of the slide on the screen if you're using `loop={true}`). |
| `cursor` | `string` | :no_entry_sign: | `'-webkit-grab'` | Css value of cursor when mouse is hovering the slider frame |
| `cursorOnMouseDown` | `string` | :no_entry_sign: | `'-webkit-grabbing'` | Css value of cursor when mouse is down |
| `duration` | `number` | :no_entry_sign: | `250` | Duration of transitions |
| `easing` | `string` | :no_entry_sign: | `'ease-out'` | Transition function |
| `loop` | `bool` | :no_entry_sign: | `false` | If the slides should be looping |
| `onChangeSlide` | `func` | :heavy_check_mark: | :no_entry_sign: | Function to change the value of currentSlide. The function should expect a `number` as it's only parameter |
| `perPage` | `number/object` | :no_entry_sign: | `1` | Amount of slides to be on the screen, if a number is passed, then that's the number of slides that will be shown, if an object with breakpoints is passed, then the component will check the size of the screen to see how many slides will be on the screen at the same time |
| `minPerPage` | `number` | :no_entry_sign: | `1` | Minimum amount of slides to be on the screen, can be used to control how many itens will be displayed in the smallest screen size |
| `resizeDebounce` | `number` | :no_entry_sign: | `250` | Resize debounce timer in milliseconds |
| `rootTag` | `string` | :no_entry_sign: | `'div'` | Tag to be rendered in the root of the slider |
| `sliderFrameTag` | `string` | :no_entry_sign: | `'ul'` | Tag to be rendered in the slider frame element |
| `threshold` | `number` | :no_entry_sign: | `50` | Minimum of pixels to drag until the slider change the `currentSlide` |

#### Slide

| Prop name | Type | isRequired | defaultValue | Description |
| --- | --- | --- | --- | --- |
| `children` | `node` | :heavy_check_mark: | :no_entry_sign: | Node to render |
| `className` | `string` | :no_entry_sign: | :no_entry_sign: | Classes to pass to the root element of the Slide |
| `defaultWidth` | `number` | :no_entry_sign: | :no_entry_sign: | Default width of the slide (only applied in the first render) |
| `tag` | `string` | :no_entry_sign: | `li` | Tag to be rendered in the root element |
| `fitImg` | `bool` | :no_entry_sign: | `true` | If the slide component should try to fit the `img` (only works if children is an `img` element) |
| `resizeDebounce` | `number` | :no_entry_sign: | `250` | Time of debounce of resize event listener |
| `sliderTransitionDuration` | `number` | :no_entry_sign: | `250` | Duration of transition passed to Slider (must be the same), if nothing is passed to any of the components it will apply the same default value |

#### SliderContainer

| Prop name | Type | isRequired | defaultValue | Description |
| --- | --- | --- | --- | --- |
| `autoplay` | `bool` | :no_entry_sign: | `false` | If the slider should be passing automatically |
| `autoplayInterval` | `number` | :no_entry_sign: | `5000` | Time in milliseconds of the interval to change the currentSlider |
| `children` | `node` | :heavy_check_mark: | :no_entry_sign: | Children of the component to render |
| `className` | `string` | :no_entry_sign: | :no_entry_sign: | Classes to be applied to the root element |
| `onNextSlide` | `func` | :no_entry_sign: | :no_entry_sign: | Function to be called if `autoplay={true}` |
| `pauseOnHover` | `bool` | :no_entry_sign: | `true` | If the interval should not be executed when the mouse is hovering the component |
| `tag` | `string` | :no_entry_sign: | `'div'` | Tag to render the component | 

#### Dots

| Prop name | Type | isRequired | defaultValue | Description |
| --- | --- | --- | --- | --- |
| `classes` | `object` | :no_entry_sign: | No extra classes applied to any element | Classes to style the elements of the component |
| `dotProps` | `object` | :no_entry_sign: | :no_entry_sign: | Extra props to be applied to the dot element |
| `dotSize` | `number/string` | :no_entry_sign: | :no_entry_sign: | The size of the dots, can be a number (in this case it will use px unit), or a string (you have to pass the number with the unit e.g `'3rem'`) |
| `dotTag` | `string` | :no_entry_sign: | `'li'` | Tag to be rendered in the dot element |
| `loop` | `bool` | :no_entry_sign: | `false` | If the slides should be looping |
| `onChangeSlide` | `func` | :heavy_check_mark: | :no_entry_sign: | Function to change the currentSlide |
| `perPage` | `number/object` | :no_entry_sign: | `1` | This prop works the same way the `perPage` of `Slider` and this component should receive the same value of `Slider` |
| `resizeDebounce` | `number` | :no_entry_sign: | `250` | Debounce time in milliseconds |
| `rootTag` | `string` | :no_entry_sign: | `'ul'` | Tag to be rendered as the root element of the component |
| `totalSlides` | `number` | :heavy_check_mark: | :no_entry_sign: | Total value of sliders that will be rendered |
| `minPerPage` | `number` | :no_entry_sign: | `1` | This prop works the same way the `minPerPage` of `Slider` and this component should receive the same value of `Slider` |
| `showDotsPerPage` | `bool` | :no_entry_sign: | `false` | If this frag is true, then every dot represent a page of slides (e.g. if `perPage = 2` and you have 4 elements, then you have 2 dots), if false, then it will render one dot to each slide |

## Styles API

You can style this app by using the props `classeName` and `classes` of the components. But if you want to style every slider of your app you need to use the [CSS namespaces](#css-namespaces) to do it.

### CSS namespaces

:construction: :construction: :construction:

## Tests

[![Coverage Status](https://coveralls.io/repos/github/vtex-apps/slider/badge.svg?branch=master)](https://coveralls.io/github/vtex-apps/slider?branch=master)

## Travis CI

[![Build Status](https://travis-ci.org/vtex-apps/slider.svg?branch=master)](https://travis-ci.org/vtex-apps/slider)
