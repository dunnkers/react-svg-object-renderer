import React, { Component } from 'react'

import SVGEditableCanvas, {
  RectObject, TextObject
} from 'svg-object-renderer';

export default class App extends Component {
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

  render () {
    return (
      <div>
        <SVGEditableCanvas
          objects={this.objects}
          objectTypes={this.objectTypes}
        />
      </div>
    )
  }
}
