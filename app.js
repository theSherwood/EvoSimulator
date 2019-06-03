import Biome from "./src/Biome.js";
import colors from "./src/colors.js";

const canvas = document.getElementById("canvas");
const root = document.getElementById("root");
const population = document.getElementById("population");
const populationChange = document.getElementById("population-change");
const newLife = document.getElementById("new-life");
const infantMortality = document.getElementById("infant-mortality");
const newDead = document.getElementById("new-dead");
const totalDeceased = document.getElementById("total-deceased");
const elapsedTime = document.getElementById("elapsed-time");

let height = 80,
  width = 160,
  order = 98,
  cull = 1,
  robust = 0.3,
  grow = 6,
  shrink = 2,
  keepAccounts = true;

let timeStep = 200;
let stepsCounter = 0;
let cellHeight;
let cellWidth;

let biome;
let timerID;

seedNewBiome();

function seedNewBiome() {
  // Effect transition to new biome (fade in/out)
  canvas.classList.remove("fully-rendered");
  setTimeout(() => {
    clearInterval(timerID);
    biome = new Biome(
      height,
      width,
      order,
      cull,
      robust,
      grow,
      shrink,
      keepAccounts
    );
    positionCanvas();
    renderLandscape(biome.landscape);
    biome.seed();
    renderEcology(biome.livingArray);

    timerID = setInterval(tick, timeStep);

    canvas.classList.add("fully-rendered");
  }, 1500);
}

function reseedBiome() {
  biome.seed();
}

function positionCanvas() {
  const pos = root.getBoundingClientRect();

  canvas.style.top = pos.top;
  canvas.style.left = pos.left;
  canvas.height = pos.height;
  canvas.width = pos.width;

  cellHeight = canvas.offsetHeight / height;
  cellWidth = canvas.offsetWidth / width;
}

function tick() {
  // console.log(timeStep);
  if (stepsCounter > 2000) {
    stepsCounter = 0;
    seedNewBiome();
  }
  biome.step();
  stepsCounter++;
  renderLandscape(biome.landscape);
  renderEcology(biome.livingArray);
  if (biome.livingArray.length === 0) {
    robust = Math.max(robust, 0.3);
    biome = new Biome(
      height,
      width,
      order,
      cull,
      robust,
      grow,
      shrink,
      keepAccounts
    );
    renderLandscape(biome.landscape);
    biome.seed();
    renderEcology(biome.livingArray);
  }
  renderReadout(biome);
}

// window.addEventListener("click", pause, true);
window.addEventListener("keydown", handleKeydown, true);
window.addEventListener("resize", positionCanvas, true);
window.addEventListener("scroll", positionCanvas, true);

function adjustSpeed(direction) {
  if (direction === "up") {
    timeStep = Math.max(timeStep / 2, 0);
    clearInterval(timerID);
    timerID = setInterval(tick, timeStep);
  } else if (direction === "down") {
    timeStep = Math.min((timeStep || 1) * 2, 12800);
    clearInterval(timerID);
    timerID = setInterval(tick, timeStep);
  }
  // console.log(timeStep);
}

function handleKeydown(e) {
  e.preventDefault();
  // console.log(e);
  switch (e.key) {
    case "ArrowUp":
      adjustSpeed("up");
      break;
    case "ArrowDown":
      adjustSpeed("down");
      break;
    case "ArrowLeft":
      robust = Math.max(biome.robust - 0.1, -0.1);
      biome.robust = robust;
      break;
    case "ArrowRight":
      robust = Math.min(biome.robust + 0.1, 1);
      biome.robust = robust;
      break;
    case "s":
      seedNewBiome();
      break;
    case "r":
      reseedBiome();
      break;
    case " ":
      pause();
      break;
  }
}

function pause() {
  if (timerID) {
    clearInterval(timerID);
    timerID = null;
  } else {
    timerID = setInterval(tick, timeStep);
  }
}

function renderLandscape(landscape) {
  const ctx = canvas.getContext("2d");

  landscape.forEach((row, i) => {
    row.forEach((cell, j) => {
      ctx.fillStyle = `rgba(${cell * 25.5},${cell * 25.5},${cell * 25.5},1)`;
      ctx.fillRect(
        Math.floor(j * cellWidth),
        Math.floor(i * cellHeight),
        Math.ceil(cellWidth),
        Math.ceil(cellHeight)
      );
    });
  });
}

function renderEcology(life) {
  // Renders an array of organisms to the screen
  life.forEach(organism => {
    renderOrganism(organism);
  });
}

function renderOrganism(organism) {
  const ctx = canvas.getContext("2d");
  const { genome, x, y } = organism;
  if (genome.length !== y[1] - y[0] + 1) {
    console.error("wrong genome length", organism);
  }
  let error = false;
  genome.forEach((row, i) => {
    if (row.length !== x[1] - x[0] + 1) {
      error = true;
    }
    row.forEach((cell, j) => {
      ctx.fillStyle = `rgb(${colors[cell].join()})`;
      ctx.fillRect(
        Math.floor((x[0] + j) * cellWidth),
        Math.floor((y[0] + i) * cellHeight),
        Math.ceil(cellWidth),
        Math.ceil(cellHeight)
      );
    });
  });

  if (error) {
    console.error("wrong row length", organism);
    pause();
  }

  ctx.strokeStyle = "#FFFFFF";
  ctx.lineWidth = "2";
  ctx.strokeRect(
    Math.floor(x[0] * cellWidth),
    Math.floor(y[0] * cellHeight),
    Math.ceil((x[1] - x[0] + 1) * cellWidth),
    Math.ceil((y[1] - y[0] + 1) * cellHeight)
  );
}

function renderReadout(biome) {
  population.textContent = pad(biome.livingArray.length, 3);
  newLife.textContent = pad(
    biome.newLife.length +
      biome.history[biome.time].aborts.length -
      biome.history[biome.time - 1].aborts.length,
    3
  );
  infantMortality.textContent = (
    (biome.history[biome.time].aborts.length -
      biome.history[biome.time - 1].aborts.length) /
      Number.parseInt(newLife.textContent) || 0
  ).toFixed(2);
  newDead.textContent = pad(biome.newDead.length, 3);
  totalDeceased.textContent = biome.dead.length;
  populationChange.textContent = pad(
    biome.history[biome.time].livingArray.length -
      biome.history[biome.time - 1].livingArray.length,
    3,
    true
  );
  elapsedTime.textContent = biome.time;
}

function pad(num, length, withSign = false) {
  const sign = num < 0 ? "-" : "+";
  const zeros = "0000000000000000";
  let str = Math.abs(num).toString();
  const difference = length - str.length;
  str = zeros.slice(0, difference) + str;
  return withSign ? sign + str : str;
}
