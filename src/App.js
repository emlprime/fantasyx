import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Characters from './stories/Characters';
class App extends Component {
  render() {
    return (
      <div className="App">
        <Characters />
        </div>
    );
  }
}

export default App;
