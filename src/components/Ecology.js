import React, { Component, Fragment } from "react";
import Organism from "./Organism";
import { Consumer } from "../context";

class Ecology extends Component {
  render() {
    return (
      <Consumer>
        {value => {
          const { landscape, cellHeight, cellWidth } = value;
          return (
            <Fragment>
              <Organism />
            </Fragment>
          );
        }}
      </Consumer>
    );
  }
}

export default Ecology;
