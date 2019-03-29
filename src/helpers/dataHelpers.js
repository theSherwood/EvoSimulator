export function randomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

export function unrollSection(landscape, xStart, xEnd, yStart, yEnd) {
  let section = [];
  for (let i = yStart; i < yEnd + 1; i++) {
    section = section.concat(landscape[i].slice(xStart, xEnd + 1));
  }
  return section;
}
