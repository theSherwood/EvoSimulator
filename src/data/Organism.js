import uuid from "uuid";
import { randomInt } from "../helpers/dataHelpers";

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
    this.lifespan = this.genome.sum() + 1;
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
    When this.isAlive turns to False, this.biome is told
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
    if (this.genome.sum() > Max * 0.1 * this.biome.grow) {
      if (temp === 0) {
        this.growTop();
      } else if (temp === 1) {
        this.growBottom();
      } else if (temp === 2) {
        this.growRight();
      } else {
        this.growLeft();
      }
    } else if (this.genome.sum() < Max * 0.1 * this.biome.shrink) {
      if (temp == 0) {
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
    const x = { ...this.x };
    const y = { ...this.y };
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
    return x, y;
  }

  mutate() {
    // mutate values of genome
    const mutType = randomInt(1, 3);
    const childGenome = [...this.genome];
    const { height, width } = this.shape;
    const mutations = randomInt(1, 4);
    for (let i = 0; i < mutations; i++) {
      const yloc = randomInt(0, height - 1);
      const xloc = randomInt(0, width - 1);
      childGenome[yloc][xloc] = randomInt(0, 10);
    }
    return childGenome;
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
    }
  }
}
