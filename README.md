<img src="example/public/logo.png">

# svg-object-renderer

> Provides selection and hovering primitives for SVG objects for React apps

[![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
yarn add http://git.offthegrid/Jeroen/svg-object-renderer.git
```

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
      height: 200
    },
    {
      type: 'text',
      x: 75,
      y: 150,
      text: 'Hello World 🦄',
      style: {
        fill: 'white'
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

![Example](example/public/canvas-example.png)

## Development

In one terminal:
```bash
yarn start
```

In another terminal:
```bash
cd example && yarn start
```

⚡
