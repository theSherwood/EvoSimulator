import React from "react";

export default function Cell(props) {
  const { x, y, width, height, fill } = props;

  return (
    <rect
      x={x}
      y={y}
      width={width}
      height={height}
      style={{
        fill
      }}
    />
  );
}
