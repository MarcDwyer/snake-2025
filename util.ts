import { YX } from "./linked_list";

export function getRandomCoordinate(y: number, x: number): [number, number] {
  return [Math.floor(Math.random() * y), Math.floor(Math.random() * x)];
}

export function isHit([aY, aX]: YX, [bY, bX]: YX) {
  return aY === bY && aX === bX;
}

export function centerOfBoard(rows, cols) {
  return [Math.floor(rows / 2), Math.floor(cols / 2)];
}

export type GetRandomCellParams = {
  yx: YX;
  board: number[][];
};
export function getRandomCell(board: number[][]): YX {
  const rowLen = board.length;
  const colLen = board[0].length;
  // short for randomCoordinates
  let randomC = getRandomCoordinate(rowLen, colLen);

  while (true) {
    if (board[randomC[0]][randomC[1]] === 0) {
      break;
    }
    randomC = getRandomCoordinate(rowLen, colLen);
  }
  return randomC;
}

export function cloneBoard(board: number[][]) {
  const clonedBoard: number[][] = [];

  for (let i = 0; i < board.length; i++) {
    clonedBoard.push([...board[i]]);
  }
  return clonedBoard;
}
