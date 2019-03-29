export function emptyLandscape(height, width) {
  return new Array(height || 0)
    .fill(0)
    .map(row => new Array(width || 0).fill(0));
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //The maximum is exclusive and the minimum is inclusive
}

export function createLandscape(height, width, order) {
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
