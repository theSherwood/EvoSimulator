import React, { Component, Fragment } from "react";
import OrganismComp from "./OrganismComp";
import { Consumer } from "../context";

class Ecology extends Component {
  render() {
    return (
      <Consumer>
        {value => {
          const { landscape, cellHeight, cellWidth } = value;
          return (
            <Fragment>
              <OrganismComp />
            </Fragment>
          );
        }}
      </Consumer>
    );
  }
}

export default Ecology;
