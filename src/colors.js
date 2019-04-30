const sat = 200; // saturation

const colorTemplates = [
  [sat, 0, 0], // red
  [sat, 0, sat / 2], // red purple
  [sat, 0, sat], // purple
  [sat / 2, 0, sat], // purple blue
  [0, 0, sat], // dark blue
  [0, sat / 2, sat], // blue
  [0, sat, sat], // light blue
  [0, sat, sat / 2], // light green
  [0, sat, 0], // green
  [sat / 2, sat, 0], // lime
  [sat, sat, 0], // yellow
  [sat, sat / 2, 0] // orange
];

// dsiplace 0 centers on blue, 1 on light blue, 2 on light green,
// 3 on green, 4 on lime, 5 on yellow, 6 on orange, 7 on red,
// 8 on red purple, 9 on purple, 10 on purple blue, 11 on dark blue
const displace = 9;
const colors = {};

for (let i = displace; i < displace + 12; i++) {
  colors[i - displace] = colorTemplates[i % 12];
}

export default colors;
