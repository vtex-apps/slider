# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

## [Unreleased]
### Changed
- Render arrows on SSR

## [0.7.3] - 2019-10-28
### Chore
- Rebuild to enable lazy evaluation of slider entrypoints.

## [0.7.2] - 2019-08-29

## [0.7.1] - 2019-08-19

## [0.7.0] - 2019-08-16

### Added

- Better handling of `Float` values in `next` and `prev` function calls in the Slider component.

## [0.6.0] - 2019-08-02

### Added

- Support for `minPerPage` prop to be passed to the Slider and Dots components.

## [0.5.8] - 2019-07-09

### Fixed

- Prevent slides from stretching (and center them) if the total number of items is smaller than the number of items visible per page.

## [0.5.7] - 2019-07-08

### Fixed

- Issue where the slider would flicker if autoplay delay was 0.

## [0.5.6] - 2019-07-04

### Fixed

- Infer slide size on SSR, to prevent flickering on hydration.

## [0.5.5] - 2019-07-01

### Fixed

- Fixes issue with SSR hydration when the quantity of items is smaller than the number of items per page.

## [0.5.4] - 2019-06-27

### Fixed

- Build assets with new builder hub.

## [0.5.3] - 2019-04-12

### Changed

- Set draggable to false as default.

## [0.5.2] - 2019-04-10

### Fixed

- Condition on `width` of `sliderFrame` when there is less items than the number of itens to show per page.

## [0.5.1] - 2019-04-02

### Fixed

- When there was less items than the number of itens to show per slide.

## [0.5.0] - 2019-04-01

### Added

- Add eslint-vtex configuration.
- Add slide per page option.

## [0.4.1] - 2019-03-29

### Fixed

- When there is only one slide and `loop` prop is set to `true` the component is rendering the arrows adding the slide events.

## [0.4.0] - 2019-03-22

### Added

- Add `loop` prop.

## [0.3.3] - 2019-03-13

### Fixed

- Add events and rendering arrows and dots when there is only one slide.

## [0.3.2] - 2019-03-13

### Fixed

- Blink in first render.

## [0.3.1] - 2019-02-28

### Fixed

- Autoplay props warnings.

## [0.3.0] - 2019-02-28

### Fixed

- Slider frame not bubbling up the touch and mouse events.

### Added

- Autoplay functionality.

## [0.2.1] - 2019-02-27

### Fixed

- Slider frame element not getting all height that it has available.

## [0.2.0] - 2019-02-27

### Added

- Add a first version of `Dots`, `Slide`, `Slider` and `SliderContainer` components.

## [0.1.0] - 2019-02-27

### Added

- Initial commit with basic structure.
