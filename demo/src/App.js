import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import SVGObjectRenderer, {
  RectObject, TextObject
} from 'svg-object-renderer';

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
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">svg-editable-canvas</h1>
        </header>
        <div className="App-intro">
          <SVGObjectRenderer
            objects={this.objects}
            objectTypes={this.objectTypes}
            onSelectionChange={() => console.log('selection changed')}
          />
        </div>
      </div>
    );
  }
}

export default App;