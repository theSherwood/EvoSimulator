import React, { Component, Fragment } from "react";
import { Consumer } from "../context";
import Cell from "./Cell";

class Landscape extends Component {
  render() {
    return (
      <Consumer>
        {value => {
          const { landscape, cellHeight, cellWidth } = value;
          return (
            <Fragment>
              {landscape.map((row, i) =>
                row.map((cell, j) => (
                  <Cell
                    key={`${i},${j}`}
                    y={`${i * cellHeight}%`}
                    x={`${j * cellWidth}%`}
                    height={`${cellHeight}%`}
                    width={`${cellWidth}%`}
                    fill={`rgba(${cell * 25.5},${cell * 25.5},${cell *
                      25.5},1)`}
                  />
                ))
              )}
            </Fragment>
          );
        }}
      </Consumer>
    );
  }
}

export default Landscape;
