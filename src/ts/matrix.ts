export class Matrix {
  data: Array<Array<number>>;
  n: number;
  m: number;

  constructor(n: number, m: number) {
    this.n = n;
    this.m = m;
  }

  static fromArray(a: Array<Array<number>>) {
    const c: Matrix = Matrix.zeros(a.length, a[0].length);
    return c.map((_, i, j) => a[i][j]);
  }

  static copy(a: Matrix): Matrix {
    const c: Matrix = new Matrix(a.n, a.m);
    c.data = a.data.map(row => row.map(col => col));
    return c;
  }

  static zeros(n: number, m: number): Matrix {
    const c: Matrix = new Matrix(n, m);
    c.data = Array(n).fill(Array(m).fill(0));
    return c;
  }

  static random(n: number, m: number, min: number, max: number): Matrix {
    const c: Matrix = Matrix.zeros(n, m);
    return c.map(() => Math.random() * (max - min) + min);
  }

  getRowArray(row: number): Array<number> {
    return this.data[row];
  }

  getColArray(col: number): Array<number> {
    return this.data.map(row => row[col]);
  }

  toArray(): Array<Array<number>> {
    return this.data;
  }

  map(func: Function): Matrix {
    const c: Matrix = Matrix.copy(this);
    c.data = c.data.map((row, i) => row.map((col, j) => func(col, i, j)));
    return c;
  }

  multiply(b: Matrix | Constant): Matrix {
    if (b instanceof Matrix) {
      const t: Matrix = Matrix.copy(this);
      const c: Matrix = Matrix.zeros(this.n, b.m);
      return c.map((_, i, j) => dot(t.getRowArray(i), b.getColArray(j)));
    } else {
      return this.map(val => val * b.data);
    }
  }

  add(b: Matrix | Constant): Matrix {
    if (b instanceof Matrix) {
      return this.map((val, i, j) => val + b.data[i][j]);
    } else {
      return this.map(val => val + b.data);
    }
  }

  subtract(b: Matrix | Constant): Matrix {
    if (b instanceof Matrix) {
      return this.add(b.multiply(new Constant(-1)));
    } else {
      return this.map(val => val - b.data);
    }
  }

  concat(b: Matrix): Matrix {
    const t: Matrix = Matrix.copy(this);
    const c: Matrix = Matrix.zeros(this.n, this.m + b.m);
    return c.map((_, i, j) => {
      if (j >= t.m) return b.data[i][j - t.m];
      else return t.data[i][j];
    });
  }

  stack(b: Matrix): Matrix {
    const t: Matrix = Matrix.copy(this);
    const c: Matrix = Matrix.zeros(this.n + b.n, this.m);
    return c.map((_, i, j) => {
      if (i >= t.n) return b.data[i - t.n][j];
      else return t.data[i][j];
    });
  }

  transpose(): Matrix {
    const t: Matrix = Matrix.copy(this);
    const c: Matrix = Matrix.zeros(this.m, this.n);
    return c.map((_, i, j) => t.data[j][i]);
  }

  print() {
    console.table(this.data);
  }
}

export class Constant {
  data: number;

  constructor(a: number) {
    this.data = a;
  }

  multiply(b: Matrix | Constant): Matrix | Constant {
    if (b instanceof Matrix) {
      return b.multiply(this);
    } else {
      return new Constant(this.data * b.data);
    }
  }

  add(b: Matrix | Constant): Matrix | Constant {
    if (b instanceof Matrix) {
      return b.add(this);
    } else {
      return new Constant(this.data + b.data);
    }
  }

  subtract(b: Matrix | Constant): Matrix | Constant {
    if (b instanceof Matrix) {
      return b.subtract(this).multiply(new Constant(-1));
    } else {
      return new Constant(this.data - b.data);
    }
  }
}

function dot(x: Array<number>, y: Array<number>): number {
  return x.map((_, i) => x[i] * y[i]).reduce((a, b) => a + b);
}
