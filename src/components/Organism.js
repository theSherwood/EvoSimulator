import React, { Component, Fragment } from "react";
import Cell from "./Cell";

class Organism extends Component {
  render() {
    const { cellHeight, cellWidth, x, y, genome, uuid } = this.props;
    return (
      <Fragment>
        <rect
          y={`${y[0] * cellHeight}%`}
          x={`${x[0] * cellWidth}%`}
          height={`${(y[1] - y[0] + 1) * cellHeight}%`}
          width={`${(x[1] - x[0] + 1) * cellWidth}%`}
          strokeWidth="2"
          stroke="rgba(255,255,255,1)"
        />
        {genome.map((row, i) =>
          row.map((cell, j) => (
            <rect
              key={`${i},${j}`}
              y={`${(y[0] + i) * cellHeight}%`}
              x={`${(x[0] + j) * cellWidth}%`}
              height={`${cellHeight}%`}
              width={`${cellWidth}%`}
              fill={`rgba(${cell * 25},${255 - cell * 25},${0},1)`}
            />
          ))
        )}
      </Fragment>
    );
  }
}

export default Organism;
