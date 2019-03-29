import React, { Fragment } from "react";

export default function TestGroup() {
  return (
    <Fragment>
      <circle
        cx="50%"
        cy="50%"
        r="40%"
        stroke="green"
        strokeWidth="4"
        fill="yellow"
      />
      <rect
        width="300"
        height="100"
        style={{
          fill: "rgb(0,0,255)",
          strokeWidth: "3",
          stroke: "rgb(0,0,0)"
        }}
      />
      <rect
        x="50"
        y="20"
        width="150"
        height="150"
        style={{
          fill: "rgb(0,0,255)",
          strokeWidth: "3",
          stroke: "rgb(0,0,0)"
        }}
      />
      <rect
        x="50"
        y="20"
        rx="20"
        ry="20"
        width="150"
        height="150"
        style={{ fill: "rgb(0,0,255)", strokeWidth: "3", stroke: "rgb(0,0,0)" }}
      />
    </Fragment>
  );
}
