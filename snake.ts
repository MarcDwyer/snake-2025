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
function updateBoard(changes: Changes, board: number[][]) {
  for (const [y, x, oldVal, newVal] of changes) {
    board[y][x] = newVal;
    const cell = document.querySelector(`.cell-${y}-${x}`);
    console.log({ y, x, oldVal, newVal, cell });
    cell?.classList.remove(CellStyles[oldVal]);
    cell?.classList.add(CellStyles[newVal]);
  }
  return board;
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

  growth: YX;
  decline: YX;

  currDir: keyof typeof Directions = "ArrowRight";

  constructor(rows: number, cols: number) {
    this.board = createBoard(rows, cols);
    this.yx = [rows, cols];
  }

  tick() {}
  init() {
    const [centerY, centerX] = centerOfBoard(this.yx[0], this.yx[1]);
    this.snake.push([centerY, centerX]);
    this.snake.push([centerY, centerX - 1]);
    const newBoard = cloneBoard(this.board);
    addSnakeToBoard(newBoard, this.snake);
    console.log({ newBoard, snake: this.snake });
    const changes = diffBoard(this.board, newBoard);
    updateBoard(changes, this.board);
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
