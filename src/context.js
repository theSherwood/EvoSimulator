import React, { Component } from "react";
import Biome from "./data/Biome";

const Context = React.createContext();

const reducer = (state, action) => {
  switch (action.type) {
    default:
      return state;
  }
};

export class Provider extends Component {
  constructor(props) {
    super(props);

    const { height, width, order } = props;

    this.biome = new Biome(height, width, order, 1, 5, 7, 2, true);

    this.state = {
      landscape: this.biome.landscape,
      livingArray: this.biome.livingArray,
      cellHeight: 100 / height,
      cellWidth: 100 / width,
      dispatch: action => this.setState(state => reducer(state, action))
    };
  }

  // componentDidMount() {
  //   this.timerID = setInterval(() => this.tick(), 10000);
  // }

  // componentWillUnmount() {
  //   clearInterval(this.timerID);
  // }

  // tick() {
  //   this.biome.step();
  //   this.setState({
  //     livingArray: this.biome.livingArray
  //   });
  // }

  render() {
    return (
      <Context.Provider value={this.state}>
        {this.props.children}
      </Context.Provider>
    );
  }
}

export const Consumer = Context.Consumer;
