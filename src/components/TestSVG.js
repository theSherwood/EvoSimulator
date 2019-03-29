import React, { Component } from "react";
import TestGroup from "./TestGroup";

class TestSVG extends Component {
  render() {
    return (
      <svg style={{ position: "absolute", width: "100%", height: "100%" }}>
        <TestGroup />
      </svg>
    );
  }
}

export default TestSVG;
