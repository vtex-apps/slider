# Slider Next

## Description

The SliderNext is the upcoming version of VTEX Slider. The main difference is that dots, arrows and slide transitions are now handled by Slider instead of its parent component.

## Table of Contents

- [Usage](#usage)
  - [Basic](#basic)
  - [SSR](#ssr)
  - [Configuration](#configuration)
- [Upcoming](#upcoming)

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
import { SliderNext } from 'vtex.slider'
```

### Basic

The simplistic way of using `SlidexNext` is:

```javascript
import Component from './**/Component'

...

const items = [...someting...]

<SliderNext>
  { items.map(item => <Component {...item} />) }
</SliderNext>

...
```

Check [configuration](#configuration) to see every prop that `SliderNext` can receive.

### SSR

To use SSR mode you need to define the `responsive` prop that will specify how many items will be presented on each breakpoint. The `responsive` object has the type:

```typescript
interface responsiveType {
  /** key is the type name such as mobile, desktop, tablet, ... */
  [key: string]: {
    breakpoint: { max: number; min: number }
    items: number
  }
}
```

So, on your component you will use it like:

```javascript
  import Component from './**/Component'

  ...

  cosnt resonsive = {
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 4,
    },
    tablet: {
      ...
    },
    mobile: {
      ...
    },
  }

  const items = [...someting...]

  <SliderNext
    ssr
    responsive={responsive}
  >
    { items.map(item => <Component {...item} />) }
  </SliderNext>

  ...
```

### Configuration

| Prop name                 | Type                       | isRequired | defaultValue | Description                                     |
| ------------------------- | -------------------------- | ---------- | ------------ | ----------------------------------------------- |
| `responsive`              | `responsiveType`           | 🚫         | 🚫           | Number of elements per breakpoint               |
| `deviceType`              | `String`                   | 🚫         | 🚫           | The device type                                 |
| `ssr`                     | `Boolean`                  | 🚫         | false        | If is SSR mode or not                           |
| `slidesToSlide`           | `Number`                   | 🚫         | 1            | Number of slides that are passed each time      |
| `slideVisibleSlides`      | `Boolean`                  | 🚫         | false        | Pass all the visible slides at once             |
| `children`                | `Node!`                    | ✅         | 🚫           | Elements to render                              |
| `showArrows`              | `Boolean`                  | 🚫         | true         | If should show arrows                           |
| `showDots`                | `Boolean`                  | 🚫         | true         | If should show dots                             |
| `removeArrowOnDeviceType` | `String or Array<String>`  | 🚫         | 🚫           | Which device types that arrows should be hidden |
| `customLeftArrow`         | `React.ReactElement<any>!` | 🚫         | 🚫           | Custom arrow on left                            |
| `customRightArrow`        | `React.ReactElement<any>!` | 🚫         | 🚫           | Custom arrow on right                           |
| `customDot`               | `React.ReactElement<any>!` | 🚫         | 🚫           | Custom dots                                     |
| `infinite`                | `Boolean`                  | 🚫         | false        | Whatever is infinite mode or not                |
| `sliderClass`             | `String`                   | 🚫         | 🚫           | Custom class for slider                         |
| `itemClass`               | `String`                   | 🚫         | 🚫           | Custom class for item                           |
| `containerClass`          | `String`                   | 🚫         | 🚫           | Custom class for container                      |
| `dotListClass`            | `String`                   | 🚫         | 🚫           | Custom class for dots                           |

## Upcoming

Features that will be added soon:

- Swipe and Drag
- Autoplay
