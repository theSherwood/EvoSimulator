import React, { Component, Fragment } from "react";
import Cell from "./Cell";

class Organism extends Component {
  constructor(props) {
    super(props);

    // this.state = {
    //   parent: props.parent,
    //   children: [],
    //   age: 0,
    //   isAlive: true,
    //   time: props.time,
    //   uuid: uuid()
    // }
  }

  render() {
    const { cellHeight, cellWidth } = this.props;
    return (
      <Fragment>
        <Cell
          key={"blah"}
          y={`${cellHeight}%`}
          x={`${cellWidth}%`}
          height={`${cellHeight}%`}
          width={`${cellWidth}%`}
          fill={`rgba(${255},${0},${0},1)`}
        />
      </Fragment>
    );
  }
}

export default Organism;
