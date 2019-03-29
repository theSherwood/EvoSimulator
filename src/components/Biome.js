import React, { Component, Fragment } from "react";
import { Consumer } from "../context";
import Ecology from "./Ecology";
import Cell from "./Cell";

class Biome extends Component {
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
                    key={`l${i},${j}`}
                    y={`${i * cellHeight}%`}
                    x={`${j * cellWidth}%`}
                    height={`${cellHeight}%`}
                    width={`${cellWidth}%`}
                    fill={`rgba(${cell * 25.5},${cell * 25.5},${cell *
                      25.5},1)`}
                  />
                ))
              )}
              <Ecology landscape={landscape} />
            </Fragment>
          );
        }}
      </Consumer>
    );
  }
}

export default Biome;
