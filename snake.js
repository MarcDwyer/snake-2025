const gameBtn = document.querySelector(".game-btn");
const gameBoard = document.querySelector(".game-board");

let rows = 10;
let cols = 10;

let currDir = "E";

let gameTimer;

let snake = [];

const dir = {
  // [y, x]
  N: [1, 0],
  S: [-1, 0],
  W: [0, -1],
  E: [0, 1],
};

function drawBoard(board) {
  for (let i = 0; i < board.length; i++) {
    const row = document.createElement("div");
    row.classList.add("row");
    for (let j = 0; j < board[i].length; j++) {
      const cell = document.createElement("div");
      cell.classList.add(`cell`);
      cell.classList.add(`cell-${i}-${j}`);
      row.appendChild(cell);
    }
    gameBoard.appendChild(row);
  }
}

function centerOfBoard(rows, cols) {
  return [Math.floor(rows / 2), Math.floor(cols / 2)];
}
// V for virtual
function createVBoard(rows, cols) {
  const board = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < cols; j++) {
      row.push(0);
    }
    board.push(row);
  }
  return board;
}
function drawSnake() {
  for (const [y, x] of snake) {
    const cell = document.querySelector(`.cell-${y}-${x}`);
    cell.classList.add("snake");
  }
}
function clearSnake() {
  const snakeCells = document.querySelectorAll(".snake");
  for (const cell of snakeCells) {
    cell.classList.remove("snake");
  }
}
function moveSnake() {
  const [currY, currX] = dir[currDir];
  const newSnake = [];

  for (let i = 0; i < snake.length; i++) {
    const [snakeY, snakeX] = snake[i];
    const newY = snakeY + currY;
    const newX = snakeX + currX;
    newSnake.push([newY, newX]);
  }
  snake = newSnake;
}
function gameTick() {
  console.log("tick");
  moveSnake();
  clearSnake();
  drawSnake();
}
function startGame() {
  const vBoard = createVBoard(rows, cols);
  const [centerY, centerX] = centerOfBoard(rows, cols);
  drawBoard(vBoard);
  snake = [
    [centerY, centerX],
    [centerY, centerX - 1],
  ];
  drawSnake();
  gameBtn.disabled = true;
  gameBtn.removeEventListener("click", startGame);

  gameTimer = setInterval(gameTick, 1000);
}

function prepareGame() {
  gameBtn.innerText = "Start Game";
  gameBtn.addEventListener("click", startGame);
}

prepareGame();
