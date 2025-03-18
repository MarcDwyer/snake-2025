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
function addSnakeToBoard(board: number[][], snake: YX[]) {
  for (const [y, x] of snake) {
    board[y][x] = 1;
  }
  return board;
}
function createBoard(
  rows: number,
  cols: number,
  values?: [number, number, number][]
) {
  const board: number[][] = [];
  for (let i = 0; i < rows; i++) {
    const col: number[] = [];
    for (let j = 0; j < cols; j++) {
      col.push(0);
    }
    board.push(col);
  }
  if (values) {
    for (const [y, x, value] of values) {
      board[y][x] = value;
    }
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
    cell?.classList.remove(CellStyles[oldVal]);
    cell?.classList.add(CellStyles[newVal]);
  }
}

function setRandomCell(board: number[][], value: number): YX {
  const [y, x] = getRandomCell(board);
  board[y][x] = value;
  return [y, x];
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
  snake: YX[] = [];

  rows: number;
  cols: number;

  growth: YX = [-1, -1];
  decline: YX = [-1, -1];

  prevTail: YX = [-1, -1];

  currDir: keyof typeof Directions = "ArrowRight";

  timer: number;

  createNewBoard: () => number[][];

  constructor(rows: number, cols: number) {
    this.board = createBoard(rows, cols);
    this.rows = rows;
    this.cols = cols;
    this.createNewBoard = () => createBoard(rows, cols);
  }
  didCollide() {
    const [headY, headX] = this.snake[0];

    return this.board[headY][headX] !== 0;
  }
  moveSnake() {
    const [dirY, dirX] = Directions[this.currDir];
    let [prevY, prevX] = this.snake[0];

    const nextHead: [number, number] = [prevY + dirY, prevX + dirX];
    for (let i = 1; i < this.snake.length; i++) {
      this.snake[i] = [...this.snake[i - 1]];
    }
    this.snake[0] = nextHead;
  }
  gameOver() {
    clearInterval(this.timer);
  }

  tick() {
    const [dirY, dirX] = Directions[this.currDir];
    const [nextY, nextX] = [this.snake[0][0] + dirY, this.snake[0][1] + dirX];
    const nextHead = this.board[nextY][nextX];

    const board = this.createNewBoard();

    if (nextHead !== 0) {
      if (nextHead === Cells.Snake || nextHead === undefined) {
        this.gameOver();
        return;
        // gameover
      } else if (nextHead === Cells.Growth) {
        //grow
        // this.snake.push(this.snake.);
        this.moveSnake();
        this.snake.push(this.prevTail);
        addSnakeToBoard(board, this.snake);
        this.growth = getRandomCell(board);
      } else {
        console.log("decline");
        // decline
        // this.snake.pop();
        // addSnakeToBoard(board, this.snake);
        // this.decline = getRandomCell(board);
      }
    } else {
      this.moveSnake();
      this.prevTail = [...this.snake[this.snake.length - 1]];
      addSnakeToBoard(board, this.snake);
    }
    board[this.growth[0]][this.growth[1]] = Cells.Growth;
    board[this.decline[0]][this.decline[1]] = Cells.Decline;
    console.log({ snake: this.snake });
    const diff = diffBoard(this.board, board);
    dispatchChanges(diff);
    this.board = board;
  }
  init() {
    const [centerY, centerX] = centerOfBoard(this.rows, this.cols);
    this.snake.push([centerY, centerX]);
    this.snake.push([centerY, centerX - 1]);

    const board = createBoard(this.rows, this.cols);
    addSnakeToBoard(board, this.snake);

    const growthCoords = setRandomCell(board, Cells.Growth);
    const declineCoords = setRandomCell(board, Cells.Decline);

    this.growth = growthCoords;
    this.decline = declineCoords;

    const diff = diffBoard(this.board, board);
    dispatchChanges(diff);
    this.board = board;
    this.timer = setInterval(() => this.tick(), 2000);

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
