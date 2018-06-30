import { Matrix, Constant } from "../src/ts/matrix";
import { expect } from "chai";
import "mocha";
import * as math from "mathjs";

const rseed: number = 10;

function validator(func: Function, ...rest): Matrix | Constant {
  if (rest.some(val => val instanceof Matrix)) {
    const args: Array<any> = rest.map(val => {
      if (val instanceof Matrix) return math.matrix(val.toArray());
      else return val.data;
    });
    return Matrix.fromArray(func(...args)._data);
  } else {
    const args: Array<number> = rest.map((val: Constant) => val.data);
    return new Constant(func(...args));
  }
}

function generateParams(seed: number): Array<number> {
  return [
    Math.floor(Math.random() * seed),
    Math.floor(Math.random() * seed * -1),
    Math.floor(Math.random() * seed),
    Math.floor(Math.random() * seed),
    Math.floor(Math.random() * seed)
  ].map(val => {
    if (val === 0) return val + 1;
    else return val;
  });
}

describe("Test Matrix arithmetic", () => {
  it("test mult matrix", () => {
    const [r1, r2, n, m, center] = generateParams(rseed);
    const a: Matrix = Matrix.random(n, center, r1, r2);
    const x: Matrix = Matrix.random(center, m, r1, r2);
    expect(a.multiply(x)).to.deep.equal(validator(math.multiply, a, x));
  });

  it("test mult const", () => {
    const [r1, r2, n, m] = generateParams(rseed);
    const a: Matrix = Matrix.random(n, m, r1, r2);
    const x: Constant = new Constant(r1 + r2);
    expect(a.multiply(x)).to.deep.equal(validator(math.multiply, a, x));
  });

  it("test add matrix", () => {
    const [r1, r2, n, m] = generateParams(rseed);
    const a: Matrix = Matrix.random(n, m, r1, r2);
    const x: Matrix = Matrix.random(n, m, r1, r2);
    expect(a.add(x)).to.deep.equal(validator(math.add, a, x));
  });

  it("test add const", () => {
    const [r1, r2, n, m] = generateParams(rseed);
    const a: Matrix = Matrix.random(n, m, r1, r2);
    const x: Constant = new Constant(r1 + r2);
    expect(a.add(x)).to.deep.equal(validator(math.add, a, x));
  });

  it("test subtract matrix", () => {
    const [r1, r2, n, m] = generateParams(rseed);
    const a: Matrix = Matrix.random(n, m, r1, r2);
    const x: Matrix = Matrix.random(n, m, r1, r2);
    expect(a.subtract(x)).to.deep.equal(validator(math.subtract, a, x));
  });

  it("test subtract const", () => {
    const [r1, r2, n, m] = generateParams(rseed);
    const a: Matrix = Matrix.random(n, m, r1, r2);
    const x: Constant = new Constant(r1 + r2);
    expect(a.subtract(x)).to.deep.equal(validator(math.subtract, a, x));
  });

  it("test concat", () => {
    const [r1, r2, n, m, z] = generateParams(rseed);
    const a: Matrix = Matrix.random(n, m, r1, r2);
    const x: Matrix = Matrix.random(n, z, r1, r2);
    const c: Matrix = a.concat(x);
    const a_cols: number = a.data[0].length;
    const x_cols: number = x.data[0].length;
    expect(c.n).to.equal(a.n);
    expect(c.m).to.equal(a.m + x.m);
    expect(c.data.map((row, i) => row.slice(0, a_cols))).to.deep.equal(a.data);
    expect(
      c.data.map((row, i) => row.slice(a_cols, a_cols + x_cols))
    ).to.deep.equal(x.data);
  });

  it("test stack", () => {
    const [r1, r2, n, m, z] = generateParams(rseed);
    const a: Matrix = Matrix.random(n, m, r1, r2);
    const x: Matrix = Matrix.random(z, m, r1, r2);
    const c: Matrix = a.stack(x);
    const a_rows: number = a.data.length;
    const x_rows: number = x.data.length;
    expect(c.n).to.equal(a.n + x.n);
    expect(c.m).to.equal(a.m);
    const cols_a: Array<Array<number>> = Array(a.m)
      .fill(null)
      .map((_, i) => a.getColArray(i));
    const cols_x: Array<Array<number>> = Array(x.m)
      .fill(null)
      .map((_, i) => x.getColArray(i));
    const cols_c: Array<Array<number>> = Array(c.m)
      .fill(null)
      .map((_, i) => c.getColArray(i));
    expect(cols_c.map((col, j) => col.slice(0, a_rows))).to.deep.equal(cols_a);
    expect(
      cols_c.map((col, j) => col.slice(a_rows, a_rows + x_rows))
    ).to.deep.equal(cols_x);
  });

  it("test transpose", () => {
    const [r1, r2, n, m] = generateParams(rseed);
    const a: Matrix = Matrix.random(n, m, r1, r2);
    expect(a.transpose()).to.deep.equal(validator(math.transpose, a));
  });
});

describe("Test Constant arithmetic", () => {
  it("test add matrix", () => {
    const [r1, r2, n, m, z] = generateParams(rseed);
    const a: Constant = new Constant(z);
    const x: Matrix = Matrix.random(n, m, r1, r2);
    expect(a.add(x)).to.deep.equal(validator(math.add, a, x));
  });

  it("test add const", () => {
    const [r1, r2, n, m, z] = generateParams(rseed);
    const a: Constant = new Constant(z);
    const x: Constant = new Constant(r1 + r2);
    expect(a.add(x)).to.deep.equal(validator(math.add, a, x));
  });

  it("test mult matrix", () => {
    const [r1, r2, n, m, z] = generateParams(rseed);
    const a: Constant = new Constant(z);
    const x: Matrix = Matrix.random(n, m, r1, r2);
    expect(a.multiply(x)).to.deep.equal(validator(math.multiply, a, x));
  });

  it("test mult const", () => {
    const [r1, r2, n, m, z] = generateParams(rseed);
    const a: Constant = new Constant(z);
    const x: Constant = new Constant(r1 + r2);
    expect(a.multiply(x)).to.deep.equal(validator(math.multiply, a, x));
  });

  it("test subtract matrix", () => {
    const [r1, r2, n, m, z] = generateParams(rseed);
    const a: Constant = new Constant(z);
    const x: Matrix = Matrix.random(n, m, r1, r2);
    expect(a.subtract(x)).to.deep.equal(validator(math.subtract, a, x));
  });

  it("test subtract const", () => {
    const [r1, r2, n, m, z] = generateParams(rseed);
    const a: Constant = new Constant(z);
    const x: Constant = new Constant(r1 + r2);
    expect(a.subtract(x)).to.deep.equal(validator(math.subtract, a, x));
  });
});

describe("Test Utility functions", () => {
  it("test vector creation", () => {
    const arr = [1,2,3,4];
    const a: Matrix = Matrix.vector(arr);
    expect(a.n).to.equal(arr.length);
    expect(a.m).to.equal(1);
  });

  it("test flattening", () => {
    const a: Matrix = Matrix.fromArray([[1],[2],[3]]);
    expect(a.flatten().length).to.equal(a.n);
    expect(1).to.equal(a.m);
  });
});