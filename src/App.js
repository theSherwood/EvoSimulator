import React, { Component } from "react";
import "./App.css";

import { Provider } from "./context";

import Canvas from "./components/Canvas";

class App extends Component {
  render() {
    return (
      <Provider height={50} width={50} order={96}>
        <Canvas />
      </Provider>
    );
  }
}

export default App;
