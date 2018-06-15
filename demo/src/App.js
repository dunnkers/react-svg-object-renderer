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
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">svg-editable-canvas</h1>
        </header>
        <div className="App-intro">
          <SVGObjectRenderer
            objects={this.objects}
            objectTypes={this.objectTypes}
          />
        </div>
      </div>
    );
  }
}

export default App;