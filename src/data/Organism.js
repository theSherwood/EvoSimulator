import uuid from "uuid";
import { randomInt, unrollSection } from "../helpers/dataHelpers";

export default class Organism {
  /*
  A 2D array consisting in digits 0-9 (cells).
  */
  constructor(
    biome = null,
    parent = null,
    genome = null,
    shape = null,
    X = null,
    Y = null
  ) {
    this.biome = biome; // what biome does this belong to
    this.parent = parent;
    this.children = [];
    this.age = 0; // time steps this has undergone
    this.isAlive = true; // this in this.biome.livingArray
    this.time = this.biome.time; // time in when this was initialized
    this.uuid = uuid();

    if (!parent) {
      // initialize random single - celled organism
      this.genome = [[randomInt(0, 10)]];
      this.shape = (1, 1); // (ydimension, xdimension)
      // places this into a random place in this.biome.landscape
      const x = randomInt(0, this.biome.landscape[1].length);
      const y = randomInt(0, this.biome.landscape[0].length);
      // location in this.biome.landscape
      this.x = [x, x]; //[firstCellx, lastCellx] coordinates in x axis
      this.y = [y, y]; //[firstCelly, lastCelly] coordinates in y axis
    } else {
      // initializes this based on inputs from parent organism
      this.genome = genome;
      this.shape = shape; // (ydimension, xdimension)
      // location in this.biome.landscape
      this.x = X; //[firstCellx, lastCellx] coordinates in x axis
      this.y = Y; //[firstCelly, lastCelly] coordinates in y axis
      // determines if/how this.shape is different from that
      // of this.parent
      this.speciation();
    }
    // correlates with size on avg
    const genomeSum = this.genome
      .reduce((a, b) => a.concat(b), [])
      .reduce((c, d) => c + d, 0);
    this.lifespan = genomeSum + 1;
    // correlates with size directly
    this.reproductiveRate = this.shape[0] * this.shape[1] + 1;
    this.survivalCheck();
    if (this.isAlive) {
      this.biome.livingArray.push(this);
      this.occupy(); // enters location info on this.biome.occupation
    } else {
      // this doesn't survive birth
      if (this.biome.keepAccounts) {
        this.biome.aborts.push(this);
      }
    }
  }

  cullCheck() {
    /*
    Tells this.survivalCheck that this should be added to
    this.biome.dead if cull limit has been reached in this's
    location.
    */
    const section = unrollSection(
      this.biome.occupiedLandscape,
      this.x[0],
      this.x[1],
      this.y[0],
      this.y[1]
    );
    if (Math.max.apply(Math, section) > this.biome.cull) {
      return false;
    }
    return true;
  }

  occupy() {
    /*
    When this is initialized, if it survives its first
    survivalCheck, this.biome is told what space is being
    occupied by this.
    */
    for (let i = this.y[0]; i < this.y[1] + 1; i++) {
      for (let j = this.x[0]; j < this.x[1] + 1; j++) {
        this.biome.occupiedLandscape[(i, j)]++;
      }
    }
  }

  disoccupy() {
    /*
    When this.isAlive turns to false, this.biome is told
    that the space this was occupying is no longer
    occupied by this.
    */
    for (let i = this.y[0]; i < this.y[1] + 1; i++) {
      for (let j = this.x[0]; j < this.x[1] + 1; j++) {
        this.biome.occupiedLandscape[(i, j)]--;
      }
    }
  }

  speciation() {
    let Max = this.shape[0] * this.shape[1] * 9;
    let temp = randomInt(0, 4);
    const genomeSum = this.genome
      .reduce((a, b) => a.concat(b), [])
      .reduce((c, d) => c + d, 0);
    if (genomeSum > Max * 0.1 * this.biome.grow) {
      if (temp === 0) {
        this.growTop();
      } else if (temp === 1) {
        this.growBottom();
      } else if (temp === 2) {
        this.growRight();
      } else {
        this.growLeft();
      }
    } else if (genomeSum < Max * 0.1 * this.biome.shrink) {
      if (temp === 0) {
        this.shrinkTop();
      } else if (temp === 1) {
        this.shrinkBottom();
      } else if (temp === 2) {
        this.shrinkRight();
      } else {
        this.shrinkLeft();
      }
    }
  }

  offsetOffspring() {
    /*
  Create offset relative to this.biome.landscape and
  this.parent.
  */
    const { height, width } = this.shape;
    const direction = randomInt(0, 4);
    let x = { ...this.x };
    let y = { ...this.y };
    if (direction < 2) {
      if (direction === 0) {
        // offset right
        x = [this.x[0] + width, this.x[1] + width];
      } else {
        // offset left
        x = [this.x[0] - width, this.x[1] - width];
      }
    } else {
      if (direction === 2) {
        // offset up
        y = [this.y[0] + height, this.y[1] + height];
      } else {
        // offset down
        y = [this.y[0] - height, this.y[1] - height];
      }
    }
    return { x, y };
  }

  mutate() {
    // mutate values of genome
    const mutType = randomInt(0, 10);
    if (mutType) {
      const childGenome = [...this.genome]; // Too shallow
      const { height, width } = this.shape;
      const mutations = randomInt(1, 4);
      for (let i = 0; i < mutations; i++) {
        const yloc = randomInt(0, height - 1);
        const xloc = randomInt(0, width - 1);
        childGenome[yloc][xloc] = randomInt(0, 10);
      }
      return childGenome;
    }
  }

  spawn() {
    const childGenome = this.mutate();
    const { x, y } = this.offsetOffspring();
    this.children.push(
      new Organism(this.biome, this, childGenome, this.shape, x, y)
    );
  }

  survivalCheck() {
    if (this.age === this.lifespan) {
      this.isAlive = false;
      return;
    }
    if (this.genome.length <= 0 || this.genome[0].length <= 0) {
      this.isAlive = false;
      return;
    }
    if (
      this.x[0] < 0 ||
      this.y[0] < 0 ||
      this.x[1] >= this.biome.landscape[0].length ||
      this.y[1] >= this.biome.landscape.length
    ) {
      this.alive = false;
      return;
    }
    if (this.biome.cull && !this.cullCheck()) {
      this.alive = false;
      return;
    }
    // arbitrary fitness function
    const section = unrollSection(
      this.biome.landscape,
      this.x[0],
      this.x[1],
      this.y[0],
      this.y[1]
    );
    const maxPossibleScore = this.shape[0] * this.shape[1] * 9;
    const sectionSum = section.reduce((a, b) => a + b, 0);
    const environmentScore = sectionSum / maxPossibleScore;
    const genomeSum = this.genome
      .reduce((a, b) => a.concat(b), [])
      .reduce((c, d) => c + d, 0);
    const organismScore = genomeSum / maxPossibleScore;
    const difference = Math.abs(environmentScore - organismScore);
    if (difference > this.biome.robust) {
      this.alive = false;
    }
  }

  step() {
    this.age++;
    if (this.age % this.reproductiveRate === 0) {
      this.spawn();
    }
    this.survivalCheck();
    if (!this.alive) {
      this.disoccupy();
    }
  }

  // grow this.genome
  growTop() {
    // add randomly generated row to top
    const { height, width } = this.shape;
    this.shape = (height + 1, width);
    const newRow = new Array(width).fill(0).map(() => randomInt(0, 10));
    this.genome.unshift(newRow);
    this.y[0]--;
  }
  growBottom() {
    // add randomly generated row to bottom
    const { height, width } = this.shape;
    this.shape = (height + 1, width);
    const newRow = new Array(width).fill(0).map(() => randomInt(0, 10));
    this.genome.push(newRow);
    this.y[1]++;
  }
  growLeft() {
    // add randomly generated column to left
    const { height, width } = this.shape;
    this.shape = (height, width + 1);
    const newRow = new Array(height).fill(0).map(() => randomInt(0, 10));
    this.genome.forEach((array, i) => {
      array.unshift(newRow[i]);
    });
    this.x[0]--;
  }
  growRight() {
    // add randomly generated column to right
    const { height, width } = this.shape;
    this.shape = (height, width + 1);
    const newRow = new Array(height).fill(0).map(() => randomInt(0, 10));
    this.genome.forEach((array, i) => {
      array.push(newRow[i]);
    });
    this.x[1]++;
  }

  // shrink self.genome:
  shrinkTop() {
    // remove top row
    if (this.y[1] - this.y[0] < 1) return;
    const { height, width } = this.shape;
    this.shape = (height - 1, width);
    this.genome = this.genome.slice(1);
    this.y[0]++;
  }
  shrinkBottom() {
    // remove bottom row
    if (this.y[1] - this.y[0] < 1) return;
    const { height, width } = this.shape;
    this.shape = (height - 1, width);
    this.genome = this.genome.slice(0, -1);
    this.y[1]--;
  }
  shrinkLeft() {
    // remove left column
    if (this.x[1] - this.x[0] < 1) return;
    const { height, width } = this.shape;
    this.shape = (height, width - 1);
    this.genome.forEach(array => {
      array.slice(1);
    });
    this.x[0]++;
  }
  shrinkRight() {
    // remove right column
    if (this.x[1] - this.x[0] < 1) return;
    const { height, width } = this.shape;
    this.shape = (height, width - 1);
    this.genome.forEach(array => {
      array.slice(0, -1);
    });
    this.x[1]--;
  }
}
