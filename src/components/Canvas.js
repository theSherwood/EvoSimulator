import React, { Component } from "react";
import Biome from "./Biome";

export default class Canvas extends Component {
  render() {
    return (
      <svg style={{ position: "absolute", width: "100%", height: "100%" }}>
        <rect x="0" y="0" width="100%" height="100%" fill="rgb(0,0,0)" />
        <Biome />
      </svg>
    );
  }
}
