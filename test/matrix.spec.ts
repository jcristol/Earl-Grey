import { Matrix } from "../src/ts/matrix";
import { expect } from "chai";
import "mocha";
import * as math from 'mathjs';

function validator(func: Function, ...rest) {
  const args: Array<any> = rest.map(val => {
    if (val instanceof Matrix) return math.matrix(val.toArray());
    else return val
  });
  return Matrix.fromArray(func(...args)._data);
}

describe("Test Matrix arithmetic", () => {
  it("test mult matrix", () => {
    const a: Matrix = Matrix.random(6,3,-5,5);
    const x: Matrix = Matrix.random(3,1,-5,5);
    expect(a.multiply(x)).to.deep.equal(validator(math.multiply, a, x))
  });

  it("test mult matrix", () => {
    const a: Matrix = Matrix.random(6,3,-5,5);
    const x: Matrix = Matrix.random(3,1,-5,5);
    expect(a.multiply(x)).to.deep.equal(validator(math.multiply, a, x));
  });

  it("test mult const", () => {
    const a: Matrix = Matrix.random(6,3,-5,5);
    const x: number = (Math.random()) * 100 - 50;
    expect(a.multiply(x)).to.deep.equal(validator(math.multiply, a, x))
  });

  it("test mult const", () => {
    const a: Matrix = Matrix.random(6,2,-5,5);
    const x: number = (Math.random()) * 100 - 50;
    expect(a.multiply(x)).to.deep.equal(validator(math.multiply, a, x));
  });

  it("test add matrix", () => {
    const a: Matrix = Matrix.random(6,3,-5,5);
    const x: Matrix = Matrix.random(6,3,-5,5);
    expect(a.add(x)).to.deep.equal(validator(math.add, a, x));
  });

  it("test add matrix", () => {
    const a: Matrix = Matrix.random(4,1,-5,5);
    const x: Matrix = Matrix.random(4,1,-5,5);
    expect(a.add(x)).to.deep.equal(validator(math.add, a, x));
  });

  it("test add const", () => {
    const a: Matrix = Matrix.random(6,3,-5,5);
    const x: number = (Math.random()) * 100 - 50;
    expect(a.add(x)).to.deep.equal(validator(math.add, a, x));
  });

  it("test add const", () => {
    const a: Matrix = Matrix.random(4,1,-5,5);
    const x: number = (Math.random()) * 100 - 50;
    expect(a.add(x)).to.deep.equal(validator(math.add, a, x));
  });

  it("test subtract matrix", () => {
    const a: Matrix = Matrix.random(6,3,-5,5);
    const x: Matrix = Matrix.random(6,3,-5,5);
    expect(a.subtract(x)).to.deep.equal(validator(math.subtract, a, x));
  });

  it("test subtract matrix", () => {
    const a: Matrix = Matrix.random(4,1,-5,5);
    const x: Matrix = Matrix.random(4,1,-5,5);
    expect(a.subtract(x)).to.deep.equal(validator(math.subtract, a, x));
  });

  it("test subtract const", () => {
    const a: Matrix = Matrix.random(6,3,-5,5);
    const x: number = (Math.random()) * 100 - 50;
    expect(a.subtract(x)).to.deep.equal(validator(math.subtract, a, x));
  });

  it("test subtract const", () => {
    const a: Matrix = Matrix.random(4,1,-5,5);
    const x: number = (Math.random()) * 100 - 50;
    expect(a.subtract(x)).to.deep.equal(validator(math.subtract, a, x));
  });

  it("test concat", () => {
    const a: Matrix = Matrix.random(6,3,-5,5);
    const x: Matrix = Matrix.random(6,1,-5,5);
    const c: Matrix = a.concat(x);
    const a_cols: number = a.data[0].length;
    const x_cols: number = x.data[0].length;
    expect(c.n).to.equal(a.n);
    expect(c.m).to.equal(a.m + x.m);
    expect(c.data.map((row, i) => row.slice(0, a_cols))).to.deep.equal(a.data);
    expect(c.data.map((row, i) => row.slice(a_cols, a_cols + x_cols))).to.deep.equal(x.data);
  });

  it("test concat", () => {
    const a: Matrix = Matrix.random(4,2,-5,5);
    const x: Matrix = Matrix.random(4,1,-5,5);
    const c: Matrix = a.concat(x);
    const a_cols: number = a.data[0].length;
    const x_cols: number = x.data[0].length;
    expect(c.n).to.equal(a.n);
    expect(c.m).to.equal(a.m + x.m);
    expect(c.data.map((row, i) => row.slice(0, a_cols))).to.deep.equal(a.data);
    expect(c.data.map((row, i) => row.slice(a_cols, a_cols + x_cols))).to.deep.equal(x.data);
  });

  it("test stack", () => {
    const a: Matrix = Matrix.random(6,4,-5,5);
    const x: Matrix = Matrix.random(8,4,-5,5);
    const c: Matrix = a.stack(x);
    const a_rows: number = a.data.length;
    const x_rows: number = x.data.length;
    expect(c.n).to.equal(a.n + x.n);
    expect(c.m).to.equal(a.m);
    const cols_a: Array<Array<number>> = Array(a.m).fill(null).map((_, i) => a.getColArray(i));
    const cols_x: Array<Array<number>> = Array(x.m).fill(null).map((_, i) => x.getColArray(i));
    const cols_c: Array<Array<number>> = Array(c.m).fill(null).map((_, i) => c.getColArray(i));
    expect(cols_c.map((col, j) => col.slice(0, a_rows))).to.deep.equal(cols_a)
    expect(cols_c.map((col, j) => col.slice(a_rows, a_rows + x_rows))).to.deep.equal(cols_x)
  });

  it("test stack", () => {
    const a: Matrix = Matrix.random(2,2,-5,5);
    const x: Matrix = Matrix.random(3,2,-5,5);
    const c: Matrix = a.stack(x);
    const a_rows: number = a.data.length;
    const x_rows: number = x.data.length;
    expect(c.n).to.equal(a.n + x.n);
    expect(c.m).to.equal(a.m);
    const cols_a: Array<Array<number>> = Array(a.m).fill(null).map((_, i) => a.getColArray(i));
    const cols_x: Array<Array<number>> = Array(x.m).fill(null).map((_, i) => x.getColArray(i));
    const cols_c: Array<Array<number>> = Array(c.m).fill(null).map((_, i) => c.getColArray(i));
    expect(cols_c.map((col, j) => col.slice(0, a_rows))).to.deep.equal(cols_a)
    expect(cols_c.map((col, j) => col.slice(a_rows, a_rows + x_rows))).to.deep.equal(cols_x)
  });

  it("test transpose", () => {
    const a: Matrix = Matrix.random(1, 2, -5, 5);
    expect(a.transpose()).to.deep.equal(validator(math.transpose, a));
  });

  it("test transpose", () => {
    const a: Matrix = Matrix.random(4, 2, -5, 5);
    expect(a.transpose()).to.deep.equal(validator(math.transpose, a));
  });
});

// describe("Test Matrix helper functions", () => {
//   it("Test creation of zero Matrix", () => {
//     const a: Matrix = Matrix.zero(2, 2);
//     expect(a).to.deep.equals(new Matrix([[0, 0], [0, 0]]));
//   });

//   it("Test creation of zero Vector", () => {
//     const a = Vector.zero(2);
//     expect(a).to.deep.equals(new Matrix([[0], [0]]));
//   });

//   it("Test toArray", () => {
//     const a = new Vector([1, 2, 3]);
//     expect(Vector.toArray(a)).to.deep.equals([1, 2, 3]);
//   });

//   it("Test creation of random Matrix", () => {
//     const a: Matrix = Matrix.random(100, 100, -4, 4);
//     expect(a.tensor.every(row => row.every(elem => elem >= -4 && elem < 4))).to
//       .be.true;
//   });

//   it("Test creation of random Vector", () => {
//     const a: Matrix = Vector.random(100, -4, 4);
//     expect(a.tensor.every(row => row.every(elem => elem >= -4 && elem < 4))).to
//       .be.true;
//   });
// });