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

    const biome = new Biome(height, width, order);

    this.state = {
      landscape: biome.landscape,
      occupiedLandscape: biome.occupiedLandscape,
      cellHeight: 100 / height,
      cellWidth: 100 / width,
      dispatch: action => this.setState(state => reducer(state, action))
    };
  }

  // componentDidMount() {
  //   this.timerID = setInterval(() => this.step(), 1000);
  // }

  // componentWillUnmount() {
  //   clearInterval(this.timerID);
  // }

  // step() {
  //   this.setState({
  //     occupiedLandscape: this.state.occupiedLandscape
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
