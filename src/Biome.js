import Organism from "./Organism.js";
import { randomInt } from "./helpers.js";

export default class Biome {
  constructor(height, width, order, cull, robust, grow, shrink, keepAccounts) {
    this.landscape = this.createLandscape(height, width, order);
    // stores how many organisms are superimposed on each cell of the landscape
    this.occupiedLandscape = this.emptyLandscape(height, width);
    // The Accounts:
    this.time = 0; // counter for time steps
    this.livingArray = []; // organisms currently alive
    this.newLife = [];
    this.keepAccounts = keepAccounts;
    this.newDead = [];
    if (this.keepAccounts) {
      // accounting isn't generally necessary (False by default)
      this.dead = []; // organisms that have died
      this.aborts = []; // organisms that couldn't survive where they were spawned
      this.history = {}; // screenshots The Accounts (other than this.history) every timestep
    } else {
      this.dead = 0; // counts dead organisms rather than stores them
    }

    // Auxiliary Parameters:
    this.robust = robust; // survival margin for organsims relative to landscape
    this.cull = cull; // number of organisms that can be superimposed
    this.grow = grow; // threshold for organisms to grow
    this.shrink = shrink; // threshold for organisms to shrink
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
    this.newLife = [];
    this.newDead = [];
    for (let i = 0; i < n; i++) {
      this.time++;
      this.livingArray.forEach(organism => {
        organism.step();
      });
      this.livingArray = this.livingArray.filter(organism => {
        if (organism.isAlive) {
          return true;
        } else {
          this.newDead.push(organism);
          if (this.keepAccounts) {
            this.dead.push(organism);
          } else {
            this.dead++;
          }
          return false;
        }
      });
    }
    if (this.keepAccounts) {
      this.history[this.time] = {
        newLife: [...this.newLife],
        newDead: [...this.newDead],
        livingArray: [...this.livingArray],
        dead: [...this.dead],
        aborts: [...this.aborts]
      };
    }
  }

  seed(minAlive = 10) {
    let attempts = 0;
    let attemptsOuter = 0;
    let max = 0;
    while (true) {
      attempts++;
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
      while (
        this.livingArray.length !== 0 &&
        this.livingArray.length < minAlive
      ) {
        max = Math.max(max, this.livingArray.length);
        attempts++;
        this.step();
        if (attempts > 100) {
          // console.log("attempt limit exceeded");
          return;
        }
      }
      if (this.livingArray.length >= minAlive) {
        break;
      }
    }
  }
}
