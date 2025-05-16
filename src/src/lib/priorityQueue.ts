export class PriorityQueue<T> {
  private items: T[] = [];
  private readonly comparator: (a: T, b: T) => number;

  constructor(comparator: (a: T, b: T) => number) {
    this.comparator = comparator;
  }

  push(item: T): void {
    let index = this.items.length;
    this.items.push(item);

    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (this.comparator(this.items[parentIndex], this.items[index]) <= 0) break;
      [this.items[parentIndex], this.items[index]] = [this.items[index], this.items[parentIndex]];
      index = parentIndex;
    }
  }

  pop(): T | undefined {
    if (this.isEmpty()) return undefined;

    const result = this.items[0];
    const last = this.items.pop()!;

    if (this.items.length > 0) {
      this.items[0] = last;
      this.heapify(0);
    }

    return result;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  size(): number {
    return this.items.length;
  }

  private heapify(index: number): void {
    const left = 2 * index + 1;
    const right = 2 * index + 2;
    let smallest = index;

    if (left < this.items.length && this.comparator(this.items[left], this.items[smallest]) < 0) {
      smallest = left;
    }

    if (right < this.items.length && this.comparator(this.items[right], this.items[smallest]) < 0) {
      smallest = right;
    }

    if (smallest !== index) {
      [this.items[index], this.items[smallest]] = [this.items[smallest], this.items[index]];
      this.heapify(smallest);
    }
  }
}
