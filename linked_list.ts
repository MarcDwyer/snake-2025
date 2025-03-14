export type YX = [number, number];

export class LinkedList {
  head: Node;
  tail: Node;
  snakeSet = new Set<string>();

  push(yx: YX) {
    const node = new Node(yx);
    if (!this.head) {
      this.head = node;
    }
    if (!this.tail) {
      this.tail = node;
    }
    node.prev = this.tail;
    this.tail.next = node;
    this.tail = node;

    this.snakeSet.add(`cell-${yx[0]}-${yx[1]}`);
  }

  checkIfSnake([y, x]: YX) {
    return this.snakeSet.has(`cell-${y}-${x}`);
  }

  pop() {
    const newTail = this.tail.prev;
    if (!newTail) return undefined;
    this.snakeSet.delete(`cell-${this.tail.yx[0]}-${this.tail.yx[1]}`);

    this.tail = newTail;
    this.tail.next = undefined;
  }

  get size() {
    return this.snakeSet.size;
  }

  *[Symbol.iterator](): Generator<Node> {
    let curr: Node | undefined = this.head;

    while (curr) {
      yield curr;
      curr = curr.next;
    }
  }
}

export class Node {
  yx: [number, number];
  constructor(yx) {
    this.yx = yx;
  }
  next?: Node;
  prev?: Node;
}
