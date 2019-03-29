import Organism from "./Organism";
import { randomInt } from "../helpers/dataHelpers";

export default class Biome {
  constructor(height, width, order, robust, grow, shrink) {
    this.landscape = this.createLandscape(height, width, order);
    this.occupiedLandscape = this.emptyLandscape(height, width);
    this.time = 0;
    this.livingArray = [];
    this.dead = [];
    this.keepAccounts = true;
    this.history = {};
  }

  emptyLandscape(height, width) {
    return new Array(height || 0)
      .fill(0)
      .map(row => new Array(width || 0).fill(0));
  }

  createLandscape(height, width, order) {
    const landscape = this.emptyLandscape(height, width);
    for (let i = 0; i < height; i++) {
      for (let j = 0; j < width; j++) {
        if (randomInt(1, 100) <= order) {
          const antecedent = randomInt(1, 4);
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
            landscape[i][j] = randomInt(0, 10);
          }
        } else {
          // random digit: no mutual information
          landscape[i][j] = randomInt(0, 10);
        }
      }
    }
    return landscape;
  }

  step(n = 1) {
    for (let i = 0; i < n; i++) {
      this.time++;
      this.livingArray.forEach(organism => {
        organism.step();
      });
      this.livingArray = this.livingArray.filter(organism => {
        if (organism.isAlive) {
          return true;
        } else {
          if (this.keepAccounts) {
            this.dead.push(organism);
          } else {
            this.dead++;
          }
          return false;
        }
      });
      if (this.keepAccounts) {
        this.history[this.time] = this.livingArray;
      }
    }
  }

  seed(minAlive = 10) {
    while (true) {
      this.time = 0;
      this.livingArray = [];
      if (this.keepAccounts) {
        this.dead = [];
        this.aborts = [];
        this.history = {};
      } else {
        this.dead = 0;
      }
      new Organism(this);
      while (0 < this.livingArray.length < minAlive) {
        this.step();
      }
      if (this.livingArray.length >= minAlive) {
        break;
      }
    }
  }
}
