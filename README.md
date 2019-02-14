<img src="docs/logo.png">

# svg-object-renderer

> Provides selection and hovering primitives for SVG objects for React apps

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
yarn add https://github.com/dunnkers/react-svg-object-renderer.git
```

(will register on npm later.)

## Features

- Multiselect
    - Use CTRL and click to multiselet
    - Only allows multi-selections of one type
- Hover feedback

## Usage

```jsx
import React, { Component } from 'react'

import SVGEditableCanvas, {
  RectObject, TextObject
} from 'svg-editable-canvas';

class App extends Component {
  objects = [
    {
      type: 'rect',
      x: 50,
      y: 50,
      width: 200,
      height: 200,
      style: {
        fill: 'white',
        stroke: 'black'
      }
    },
    {
      type: 'rect',
      x: 200,
      y: 200,
      width: 100,
      height: 100,
      style: {
        fill: 'beige',
        stroke: 'black'
      }
    },
    {
      type: 'text',
      x: 90,
      y: 155,
      text: 'a piece of text',
      style: {
        fill: 'black'
      }
    },
    {
      type: 'text',
      x: 220,
      y: 255,
      text: 'another one!',
      style: {
        fill: 'black',
        fontSize: 11
      }
    }
  ]

  objectTypes = {
    rect: RectObject,
    text: TextObject
  }

  render() {
    return (
      <SVGEditableCanvas
        objects={this.objects}
        objectTypes={this.objectTypes}
        onSelectionChange={selectedObjects => {
          // array of indices from `objects`
          console.log(selectedObjects);
        }}
      />
    );
  }
}

export default App;
```

This renders:

![Example](docs/canvas-example.png)

ℹ Note that in any object you create, coordinates must be top-level properties.

## Options

*multipleTypeSelection*
> default: `false`

Allows selecting objects of different types. Default behaviour is disallowing selecting multiple different types.

```jsx
<SVGEditableCanvas multipleTypeSelection={true} />
```

## Development

In one terminal build the library files:
```bash
yarn watch
```

Launch the demo app in another terminal:
```bash
cd demo && yarn start
```

⚡
