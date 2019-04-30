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

export function uuidv4() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
}
