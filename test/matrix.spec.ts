import { Matrix } from "../src/ts/matrix";
import { expect } from "chai";
import "mocha";
import * as math from "mathjs";

const rseed: number = 10;

function validator(func: Function, ...rest): Matrix {
  const args: Array<any> = rest.map(val => {
    if (val instanceof Matrix) return math.matrix(val.toArray());
    else return val;
  });
  return Matrix.fromArray(func(...args)._data);
}

function generateParams(seed: number): Array<number> {
  return [
    Math.floor(Math.random() * seed),
    Math.floor(Math.random() * seed * -1),
    Math.floor(Math.random() * seed),
    Math.floor(Math.random() * seed),
    Math.floor(Math.random() * seed)
  ].map(val => {
    if(val === 0) return val + 1;
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
    const x: number = r1 + r2;
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
    const x: number = r1 + r2;
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
    const x: number = r1 + r2;
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