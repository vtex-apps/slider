# VTEX Slider

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

| Prop name                 | Type                             | isRequired | defaultValue | Description                                     |
| ------------------------- | -------------------------------- | ---------- | ------------ | ----------------------------------------------- |
| `responsive`              | `responsiveType`                 | 🚫         | 🚫           | Number of elements per breakpoint               |
| `deviceType`              | `string`                         | 🚫         | 🚫           | The device type                                 |
| `ssr`                     | `boolean`                        | 🚫         | false        | If is SSR mode or not                           |
| `slidesToSlide`           | `number`                         | 🚫         | 1            | Number of slides that are passed each time      |
| `slideVisibleSlides`      | `boolean`                        | 🚫         | false        | Pass all the visible slides at once             |
| `children`                | `any`                            | ✅         | 🚫           | Elements to render                              |
| `showArrows`              | `boolean`                        | 🚫         | true         | If should show arrows                           |
| `showDots`                | `boolean`                        | 🚫         | true         | If should show dots                             |
| `removeArrowOnDeviceType` | `string / Array<string>`         | 🚫         | 🚫           | Which device types that arrows should be hidden |
| `customLeftArrow`         | `React.ReactElement<any> / null` | 🚫         | 🚫           | Custom arrow on left                            |
| `customRightArrow`        | `React.ReactElement<any> / null` | 🚫         | 🚫           | Custom arrow on right                           |
| `customDot`               | `React.ReactElement<any> / null` | 🚫         | 🚫           | Custom dots                                     |
| `infinite`                | boolean                          | 🚫         | false        | Whatever is infinite mode or not                |
| `sliderClass`             | string                           | 🚫         | ''           | Custom class for slider                         |
| `itemClass`               | string                           | 🚫         | ''           | Custom class for item                           |
| `containerClass`          | string                           | 🚫         | ''           | Custom class for container                      |
| `dotListClass`            | string                           | 🚫         | ''           | Custom class for dots                           |

## Upcoming

Features that will be added soon:

- Swipe and Drag
- Autoplay
