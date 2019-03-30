import React, { Component, Fragment } from "react";
import Organism from "./Organism";
import { Consumer } from "../context";

class Ecology extends Component {
  render() {
    return (
      <Consumer>
        {value => {
          const { livingArray, cellHeight, cellWidth } = value;
          return (
            <Fragment>
              {livingArray.map(organism => (
                <Organism
                  key={organism.uuid}
                  cellHeight={cellHeight}
                  cellWidth={cellWidth}
                  x={organism.x}
                  y={organism.y}
                  genome={organism.genome}
                />
              ))}
            </Fragment>
          );
        }}
      </Consumer>
    );
  }
}

export default Ecology;
