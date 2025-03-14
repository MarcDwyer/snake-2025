import { drawBoard } from "./draw";
import { LinkedList, YX } from "./linked_list";
import { centerOfBoard, cloneBoard, getRandomCell } from "./util";

export enum Cells {
  Empty = 0,
  Snake = 1,
  Growth = 2,
  Decline = 3,
}
export const CellStyles = {
  0: "empty",
  1: "snake",
  2: "growth",
  3: "decline",
};
function addSnakeToBoard(board: number[][], snake: LinkedList) {
  for (const {
    yx: [y, x],
  } of snake) {
    console.log(y, x);
    board[y][x] = 1;
  }
  return board;
}
function setGrowthDeclineCells(board: number[][]) {
  const growth = getRandomCell(board);
  const decline = getRandomCell(board);
  // const { growth, decline } = this;
  board[growth[0]][growth[1]] = Cells.Growth;
  board[decline[0]][decline[1]] = Cells.Decline;
  return [growth, decline];
}
function createBoard(rows: number, cols: number) {
  const board: number[][] = [];
  for (let i = 0; i < rows; i++) {
    const col: number[] = [];
    for (let j = 0; j < cols; j++) {
      col.push(0);
    }
    board.push(col);
  }
  return board;
}
type Changes = [number, number, number, number][];
function diffBoard(prevBoard: number[][], board: number[][]) {
  const changes: Changes = [];
  for (let y = 0; y < prevBoard.length; y++) {
    for (let x = 0; x < prevBoard[y].length; x++) {
      if (prevBoard[y][x] !== board[y][x]) {
        changes.push([y, x, prevBoard[y][x], board[y][x]]);
      }
    }
  }
  return changes;
}
function dispatchChanges(changes: Changes) {
  for (const [y, x, oldVal, newVal] of changes) {
    const cell = document.querySelector(`.cell-${y}-${x}`);
    console.log({ y, x, oldVal, newVal, cell });
    cell?.classList.remove(CellStyles[oldVal]);
    cell?.classList.add(CellStyles[newVal]);
  }
}
function setGrowthAndDecline(board: number[][]) {
  const [growthY, growthX] = getRandomCell(board);
  const [declineY, declineX] = getRandomCell(board);

  board[growthY][growthX] = Cells.Growth;
  board[declineY][declineX] = Cells.Decline;
}

const Directions = {
  // [y, x]
  ArrowUp: [-1, 0],
  ArrowDown: [1, 0],
  ArrowLeft: [0, -1],
  ArrowRight: [0, 1],
};

export class Board {
  board: number[][];
  snake = new LinkedList();
  /**
   * Total length of board y = rows while x = cols
   */
  yx: YX;

  rows: number;
  cols: number;

  growth: YX;
  decline: YX;

  currDir: keyof typeof Directions = "ArrowRight";

  timer: number;

  constructor(rows: number, cols: number) {
    this.board = createBoard(rows, cols);
    this.yx = [rows, cols];
    this.rows = rows;
    this.cols = cols;
  }
  didCollide() {
    const [headY, headX] = this.snake.head.yx;

    return this.board[headY][headX] !== 0;
  }
  moveSnake() {
    const [dirY, dirX] = Directions[this.currDir];
    let prevY = this.snake.head.yx[0];
    let prevX = this.snake.head.yx[1];

    const nextHead: [number, number] = [prevY + dirY, prevX + dirX];

    this.snake.head.yx = nextHead;

    for (const node of this.snake) {
      if (!(this.snake.head === node)) {
        node.yx = [prevY, prevX];
      }
    }
  }
  gameOver() {
    clearInterval(this.timer);
  }
  tick() {
    this.moveSnake();
    const [headY, headX] = this.snake.head.yx;
    const headCell = this.board[headY]?.[headX];
    if (headCell !== 0) {
      if (headCell === Cells.Snake || headCell === undefined) {
        console.log("game over");
        this.gameOver();
        return;
        // gameover
      } else if (headCell === Cells.Growth) {
        //grow
      } else {
        // decline
      }
    }
    const board = createBoard(this.rows, this.cols);

    addSnakeToBoard(board, this.snake);
    const diff = diffBoard(this.board, board);
    dispatchChanges(diff);
    this.board = board;
  }
  init() {
    const [centerY, centerX] = centerOfBoard(this.yx[0], this.yx[1]);
    this.snake.push([centerY, centerX]);
    this.snake.push([centerY, centerX - 1]);
    // this.tick();
    const board = createBoard(this.rows, this.cols);
    addSnakeToBoard(board, this.snake);
    setGrowthAndDecline(board);
    const diff = diffBoard(this.board, board);
    dispatchChanges(diff);
    this.board = board;
    this.timer = setInterval(() => this.tick(), 1000);

    document.addEventListener("keydown", (e) => {
      if (e.key in Directions) {
        //@ts-ignore
        this.currDir = e.key;
      }
    });
    // setGrowthDeclineCells(newBoard);
  }
}

const gameBtn = document.querySelector(".game-btn");
const cols = 10,
  rows = 10;
const board = new Board(10, 10);

drawBoard(rows, cols);

gameBtn?.addEventListener("click", () => {
  board.init();
});
