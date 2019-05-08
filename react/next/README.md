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
import Product from './Product'

const products = [{ name: 'name', price: 50 }, ... ]

<SliderNext>
  { products.map(product => <Product {...product} />) }
</SliderNext>
```

Check [configuration](#configuration) to see every prop that `SliderNext` can receive.

### SSR

To use SSR mode you need to define the `ssr` prop that will specify how many items will be presented on each breakpoint. The `ssr` object has the type:

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
  import Product from './Product'

  cosnt ssr = {
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
  
  const products = [
    { name: 'name', price: 50 },
    // ...
  ]

  <SliderNext
    ssr={ssr}
  >
    { products.map(product => <Product {...product} />) }
  </SliderNext>
  
```

### Configuration

| Prop name | Type | isRequired | defaultValue | Description |
| --- | --- | --- | --- | --- |
| `responsive` | `responsiveType` | 🚫| 🚫 | Number of elements per breakpoint |
| `deviceType` | `String`  | 🚫 | 🚫 | The device type |
| `ssr`  | `Boolean` | 🚫 | false | If is SSR mode or not |
| `slidesToSlide`  | `Number` | 🚫 | 1 | Number of slides that are passed each time |
| `slideVisibleSlides` | `Boolean` | 🚫 | false | Pass all the visible slides at once |
| `children` | `Array<Node!>` | ✅ | 🚫 | Elements to render |
| `showArrows`  | `Boolean` | 🚫 | true | If should show arrows |
| `showDots` | `Boolean` | 🚫 | true | If should show dots |
| `removeArrowOnDeviceType` | `Array<String!>`  | 🚫 | 🚫 | Which device types that arrows should be hidden |
| `customLeftArrow` | `ComponentType<any>!` | 🚫 | 🚫 | Custom arrow on left |
| `customRightArrow` | `ComponentType<any>!` | 🚫         | 🚫 | Custom arrow on right |
| `customDot` | `ComponentType<any>!` | 🚫 | 🚫           | Custom dots |
| `infinite` | `Boolean` | 🚫 | false | Whatever is infinite mode or not |
| `sliderClass` | `String` | 🚫 | 🚫 | Custom class for slider |
| `itemClass` | `String` | 🚫 | 🚫 | Custom class for item |
| `containerClass` | `String` | 🚫 | 🚫 | Custom class for container |
| `dotListClass` | `String` | 🚫 | 🚫 | Custom class for dots |

## Upcoming

Features that will be added soon:

- Autoplay to support `carousel`
- Content Loader (Skeleton)
- Drag and Swipe
- Create an infinite loop impression (Circular Queue).
