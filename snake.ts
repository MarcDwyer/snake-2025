import { YX } from "./linked_list";

const gameBtn = document.querySelector(".game-btn") as HTMLElement;
const gameBoard = document.querySelector(".game-board") as HTMLElement;

let rows = 10;
let cols = 10;

let currDir = "ArrowRight";

let gameTimer;

let snake: YX[] = [];

const dir = {
  // [y, x]
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
};

function drawBoard() {
  for (let i = 0; i < rows; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < cols; j++) {
      const cell = document.createElement("div");
      cell.classList.add(`cell`);
      cell.classList.add(`cell-${i}-${j}`);
      row.appendChild(cell);
    }
    gameBoard?.appendChild(row);
  }
}

function centerOfBoard(rows, cols) {
  return [Math.floor(rows / 2), Math.floor(cols / 2)];
}

function drawSnake() {
  for (const [y, x] of snake) {
    const cell = document.querySelector(`.cell-${y}-${x}`);
    cell?.classList.add("snake");
  }
}
function clearSnake() {
  const snakeCells = document.querySelectorAll(".snake");
  for (const cell of snakeCells) {
    cell.classList.remove("snake");
  }
}
function moveSnake() {
  let prevY = snake[0][0];
  let prevX = snake[0][1];

  const [dirY, dirX] = dir[currDir];

  const updatedSnake: YX[] = [];

  updatedSnake.push([prevY + dirY, prevX + dirX]);

  if (snake.length <= 1) return;

  for (let i = 1; i < snake.length; i++) {
    const [cellY, cellX] = snake[i];
    updatedSnake.push([prevY, prevX]);
    prevY = cellY;
    prevX = cellX;
  }
  snake = updatedSnake;
}
function isInBounds() {
  const [headY, headX] = snake[0];
  if (headY < 0 || headY >= rows || headX >= cols || headX < 0) {
    return false;
  }
  return true;
}
function handleDirChange(e) {
  currDir = e.key;
}
function gameOver() {
  if (gameBtn) {
    gameBtn.innerText = "Play again";
    //@ts-ignore
    gameBtn.disabled = false;
  }
}
function gameTick() {
  moveSnake();
  const inBounds = isInBounds();
  if (!inBounds) {
    clearInterval(gameTimer);
    gameOver();
  } else {
    clearSnake();
    drawSnake();
  }
}
function startGame() {
  clearSnake();
  const [centerY, centerX] = centerOfBoard(rows, cols);
  drawBoard();
  snake = [
    [centerY, centerX],
    [centerY, centerX - 1],
  ];
  drawSnake();
  //@ts-ignore
  gameBtn.disabled = true;
  gameBtn.removeEventListener("click", startGame);
  document.addEventListener("keydown", handleDirChange);
  gameTimer = setInterval(gameTick, 1000);
}

function prepareGame() {
  gameBtn.innerText = "Start Game";
  gameBtn.addEventListener("click", startGame);
}
prepareGame();
