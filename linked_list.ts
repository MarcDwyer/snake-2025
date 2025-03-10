export type YX = [number, number];

export class LinkedList {
  head: Node;
  tail: Node;

  push(yx: YX) {
    const node = new Node(yx);
    node.prev = this.tail;
    this.tail.next = node;
    this.tail = node;
  }

  pop() {
    const newTail = this.tail.prev;
    if (!newTail) return undefined;

    this.tail = newTail;
    this.tail.next = undefined;
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
