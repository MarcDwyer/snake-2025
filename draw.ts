import { LinkedList, YX } from "./linked_list";

export function drawSnake(snake: LinkedList) {
  for (const {
    yx: [y, x],
  } of snake) {
    const snakeCell = document.querySelector(`cell-${y}-${x}`);
    snakeCell?.classList.add("snake");
  }
}

export type DrawCellParams = {
  yx: YX;
  type: number;
};
export function drawCell({ yx: [y, x], type }: DrawCellParams) {
  const cell = document.querySelector(`cell-${y}-${x}`);

  if (type === 2) {
    cell?.classList.add("growth");
  } else {
    cell?.classList.add("decline");
  }
}

export function drawBoard1(board: number[][]) {
  for (let y = 0; y < board.length; y++) {
    for (let x = 0; x < board[y].length; x++) {
      const cell = document.querySelector(`cell-${y}-${x}`);
      const cellValue = board[y][x];
    }
  }
}
export function drawBoard(rows: number, cols: number) {
  const gameBoard = document.querySelector(".game-board");
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
