export class Tensor {
  data: Array<Tensor> | number;
  dimensions: Array<number>;

  // do not directly call please
  constructor(...dimensions: Array<number>) {
    this.dimensions = dimensions;
    this.data = Array(0);
  }

  static copy(t: Tensor): Tensor {
    const result: Tensor = new Tensor(...t.dimensions);
    if (t.data instanceof Array) {
      result.data = t.data.map(tensor => Tensor.copy(tensor));
    } else {
      result.data = t.data;
    }
    return result;
  }

  static zeros(...dimensions: Array<number>): Tensor {
    const t = new Tensor(...dimensions);
    if (t.dimensions.length) {
      const dimension: number = t.dimensions[0];
      Array(dimension)
        .fill(null)
        .forEach(() =>
          (<Array<Tensor>>t.data).push(new Tensor(...t.dimensions.slice(1)))
        );
    } else {
      t.data = 0;
    }
    return t;
  }

  toArray(): Array<any> | number {
    if (this.data instanceof Array) {
      return this.data.map(tensor => tensor.toArray());
    } else {
      return this.data;
    }
  }
}

// export class Matrix {
//   tensor: Array<Array<number>>;
//   n: number;
//   m: number;
//   static create: Function;
//   static zero: Function;
//   static random: Function;

//   constructor(tensor: Array<Array<number>>) {
//     this.n = tensor.length;
//     this.m = tensor[0].length;
//     this.tensor = tensor;
//   }

//   getRowArray(row: number): Array<number> {
//     return this.tensor[row];
//   }

//   getColArray(col: number): Array<number> {
//     return this.tensor.map(row => row[col]);
//   }

//   static multiply(a: Matrix, b: Matrix): Matrix {
//     return Matrix.zero(a.n, b.m).map((_, i, j) =>
//       dot(a.getRowArray(i), b.getColArray(j))
//     );
//   }

//   static multiplicationElemWise(a: Matrix, b: Matrix): Matrix {
//     return Matrix.zero(a.n, a.m).map((_, i, j) => {
//       return a.tensor[i][j] * b.tensor[i][j];
//     })
//   }

//   multiply(a: number): Matrix {
//     return Matrix.zero(this.n, this.m).map(
//       (t, i, j) => t.tensor[i][j] * a,
//       this
//     );
//   }

//   // TODO: poopy logic
//   normalizeRows(): Matrix {
//     return new Matrix(Matrix.zero(this.n, this.m).map((t, i, j) => t.tensor[i][j], this)
//       .tensor
//       .map(row => {
//         const sum = row.reduce((acc, cur) => acc + cur);
//         return row.map(elem => elem / sum);
//       }));
//   }

//   static add(a: Matrix, b: Matrix): Matrix {
//     return Matrix.zero(a.n, b.m).map(
//       (_, i, j) => a.tensor[i][j] + b.tensor[i][j]
//     );
//   }

//   static subtract(a: Matrix, b: Matrix): Matrix {
//     return Matrix.zero(a.n, b.m).map(
//       (_, i, j) => a.tensor[i][j] - b.tensor[i][j]
//     );
//   }

//   static concat(a: Matrix, b: Matrix): Matrix {
//     return Matrix.zero(a.n, a.m + b.m).map((_, i, j) => {
//       if (j >= a.m) return b.tensor[i][j - a.m];
//       else return a.tensor[i][j];
//     });
//   }

//   static stack(a: Matrix, b: Matrix): Matrix {
//     return Matrix.zero(a.n + b.n, a.m).map((_, i, j) => {
//       if (i >= a.n) return b.tensor[i - a.n][j];
//       else return a.tensor[i][j];
//     });
//   }

//   add(a: number): Matrix {
//     return Matrix.zero(this.n, this.m).map(
//       (t, i, j) => t.tensor[i][j] + a,
//       this
//     );
//   }

//   transpose(): Matrix {
//     return Matrix.zero(this.m, this.n).map((t, i, j) => t.tensor[j][i], this);
//   }

//   map(func: Function, thisArg?: Matrix): Matrix {
//     return new Matrix(
//       this.tensor.map((row, i) => {
//         return row.map((col, j) => {
//           if (thisArg) return func(thisArg, i, j);
//           else return func(this, i, j);
//         });
//       })
//     );
//   }

//   print() {
//     console.table(this.tensor);
//   }
// }

// Matrix.create = function(rows: number, cols: number, init: Function) {
//   return new Matrix(d2Array(rows, cols, init));
// };

// Matrix.zero = function(rows: number, cols: number): Matrix {
//   return new Matrix(d2Array(rows, cols, () => 0));
// };

// Matrix.random = function(
//   rows: number,
//   cols: number,
//   min?: number,
//   max?: number
// ): Matrix {
//   if (max && min)
//     return new Matrix(
//       d2Array(rows, cols, () => Math.random() * (max - min) + min)
//     );
//   else
//     return new Matrix(
//       d2Array(rows, cols, () => Math.floor(Math.random() * 10))
//     );
// };

// export class Vector extends Matrix {
//   static toArray: Function;

//   constructor(tensor: Array<number>) {
//     super(tensor.map(n => [n]));
//   }
// }

// Vector.create = function(rows: number, init: Function) {
//   return Matrix.create(rows, 1, init);
// };

// Vector.zero = function(rows: number) {
//   return Matrix.zero(rows, 1);
// };

// Vector.random = function(rows: number, min?: number, max?: number) {
//   if (max && min) return Matrix.random(rows, 1, min, max);
//   else return Matrix.random(rows, 1);
// };

// Vector.toArray = function(m: Vector): Array<number> {
//   return m.tensor.map((row: Array<number>) => row[0]);
// };

// function d2Array(n: number, m: number, init: Function): Array<Array<number>> {
//   return Array(n).fill(Array(m).fill(null)).map( row => row.map(() => init()))
// }

// function dot(x: Array<number>, y: Array<number>): number {
//   return x.map((_, i) => x[i] * y[i]).reduce((a, b) => a + b);
// }
