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

### Resposive

The `elements` prop will specify how many items will be presented on each breakpoint (`visible`) and how many elements will be passed each type (`toPass`). The `elements` object has the type:

```typescript
interface responsiveType {
  /** key is the type name such as mobile, desktop, tablet, ... */
  [key: string]: {
    breakpoint: { max: number; min: number }
    items: number
  }
}

interface SliderProps {
  /** Element props */
  elements: {
    /** Number of visible elements per breakpoint */
    visible: responsiveType
    /** Number of elements that are passed each time 1 to visible */
    toPass?: number | 'visible'
  }
}
```

So, on your component you will use it like:

```javascript
import Product from './Product'

const visibleElements = {
  desktop: {
    breakpoint: { max: 3000, min: 1024 },
    items: 4,
  },
  tablet: {
    // ...
  },
  mobile: {
    // ...
  },
}
  
const products = [
  { name: 'name', price: 50 },
  // ...
]

<SliderNext
  elements={{
    visible: visibleElements,
    toPass: 'visible' // will pass every visible element each arrow click
  }}
>
  { products.map(product => <Product {...product} />) }
</SliderNext>  
```

### Configuration

| Prop name | Type | isRequired | defaultValue | Description |
| --- | --- | --- | --- | --- |
| `label` | `String` | 🚫 | 'VTEX Slider' | Aria label of slider
| `deviceType` | `String`  | 🚫 | 🚫 | The device type |
| `elements` | `SliderElements`  | ✅ | - | Elements props |
| `children` | `Array<Node!>` | ✅ | 🚫 | Elements to render |
| `showArrows`  | `Boolean` | 🚫 | true | If should show arrows |
| `showDots` | `Boolean` | 🚫 | true | If should show dots |
| `removeArrowOnDeviceType` | `Array<String!>`  | 🚫 | 🚫 | Which device types that arrows should be hidden |
| `customLeftArrow` | `ComponentType<any>!` | 🚫 | 🚫 | Custom arrow on left |
| `customRightArrow` | `ComponentType<any>!` | 🚫 | 🚫 | Custom arrow on right |
| `customDot` | `ComponentType<any>!` | 🚫 | 🚫 | Custom dots |
| `infinite` | `Boolean` | 🚫 | true | Whatever is infinite mode or not |
| `classNames` | `ClassNames` | 🚫 | - | Custom classes |

**SliderElements Type**

| Prop name | Type | isRequired | defaultValue | Description |
| --- | --- | --- | --- | --- |
| `visible` | `responsiveType` | ✅ | `every: { breakpoint: { max: 3840, min: 0 }, items: 1}` | Number of visible elements per breakpoint |
| `toPass` | `Number | 'visible'` | 🚫 | 1 | Number of elements that are passed each time 1 to visible |

**ClassNames Type**

| Prop name | Type | isRequired | defaultValue | Description |
| --- | --- | --- | --- | --- |
| `slider` | `String` | 🚫 | `''` | Custom classes for slider |
| `container` | `String` | 🚫 | `''` | Custom classes for container | 
| `item` | `String` | 🚫 | `''` | Custom classes for item | 
| `leftArrow` | `String` | 🚫 | `''` | Custom classes for left arrow | 
| `rightArrow` | `String` | 🚫 | `''` | Custom classes for right arrow | 
| `dotList` | `String` | 🚫 | `''` | Custom classes for the dot list |
| `dot` | `String` | 🚫 | `''` | Custom classes for a single dot | 

## Upcoming

Features that will be added soon:

- Autoplay to support `carousel`
- Content Loader (Skeleton)
- Drag and Swipe
- Create an infinite loop impression (Circular Queue).
