import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import SVGObjectRenderer, {
  RectObject, TextObject, CellObject
} from 'svg-object-renderer';

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
    },
    {
      type: 'cell',
      x: 130,
      y: 270,
      value: 'a cell'
    }
  ]

  objectTypes = {
    rect: RectObject,
    text: TextObject,
    cell: CellObject
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">svg-object-renderer</h1>
        </header>
        <div className="App-intro">
          <SVGObjectRenderer
            objects={this.objects}
            objectTypes={this.objectTypes}
            onSelectionChange={(selected) => console.warn('onSelectionChange', selected)}
          >
            <text x={15} y={30}>unselectable text</text>
          </SVGObjectRenderer>
        </div>
      </div>
    );
  }
}

export default App;