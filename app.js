import Biome from "./src/Biome.js";
import colors from "./src/colors.js";

let height = 80,
  width = 160,
  order = 98,
  cull = 1,
  robust = 0.3,
  grow = 6,
  shrink = 2,
  keepAccounts = false;

let timeStep = 0;
let stepsCounter = 0;
let cellHeight;
let cellWidth;

let biome;
let timerID;

seedNewBiome();

function seedNewBiome() {
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
}

function reseedBiome() {
  biome.seed();
}

function positionCanvas() {
  const root = document.getElementById("root");
  const canvas = document.getElementById("canvas");
  const pos = root.getBoundingClientRect();

  canvas.style.top = pos.top;
  canvas.style.left = pos.left;
  canvas.height = pos.height;
  canvas.width = pos.width;

  cellHeight = canvas.offsetHeight / height;
  cellWidth = canvas.offsetWidth / width;
}

function tick() {
  console.log(timeStep);
  // if (stepsCounter > 200) {
  //   stepsCounter = 0;
  //   biome.seed();
  // }
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
}

function handleKeydown(e) {
  console.log(e);
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
  const canvas = document.getElementById("canvas");
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
  const canvas = document.getElementById("canvas");
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