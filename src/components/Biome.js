import React, { Component, Fragment } from "react";
import Cell from "./Cell";

function emptyLandscape(height, width) {
  return new Array(height || 0)
    .fill(0)
    .map(row => new Array(width || 0).fill(0));
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

function createLandscape(height, width, order) {
  const landscape = emptyLandscape(height, width);
  for (let i = 0; i < height; i++) {
    for (let j = 0; j < width; j++) {
      if (getRandomInt(1, 100) <= order) {
        const antecedent = getRandomInt(1, 4);
        if (antecedent === 1 && i > 0) {
          // copy cell above if it exists
          landscape[i][j] = landscape[i - 1][j];
        } else if (antecedent === 2 && j > 0) {
          // copy cell to left if it exists
          landscape[i][j] = landscape[i][j - 1];
        } else if (antecedent === 3 && i > 0 && j > 0) {
          // copy cell above and to the left if it exists
          landscape[i][j] = landscape[i - 1][j - 1];
        } else {
          // random digit: no mutual information
          landscape[i][j] = getRandomInt(0, 10);
        }
      } else {
        // random digit: no mutual information
        landscape[i][j] = getRandomInt(0, 10);
      }
    }
  }
  return landscape;
}

class Biome extends Component {
  constructor(props) {
    super(props);

    const { height, width, order } = props;

    this.state = {
      landscape: createLandscape(height, width, order),
      cellHeight: 100 / height,
      cellWidth: 100 / width
    };
  }

  render() {
    const { landscape, cellHeight, cellWidth } = this.state;
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
              fill={`rgba(${cell * 25.5},${cell * 25.5},${cell * 25.5},1)`}
            />
          ))
        )}
      </Fragment>
    );
  }
}

export default Biome;
