"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Matrix {
    constructor(n, m) {
        this.n = n;
        this.m = m;
    }
    static vector(a) {
        const c = Matrix.zeros(a.length, 1);
        return c.map((_, i, j) => a[i]);
    }
    static fromArray(a) {
        const c = Matrix.zeros(a.length, a[0].length);
        return c.map((_, i, j) => a[i][j]);
    }
    static copy(a) {
        const c = new Matrix(a.n, a.m);
        c.data = a.data.map(row => row.map(col => col));
        return c;
    }
    static zeros(n, m) {
        const c = new Matrix(n, m);
        c.data = Array(n).fill(Array(m).fill(0));
        return c;
    }
    static random(n, m, min, max) {
        const c = Matrix.zeros(n, m);
        return c.map(() => Math.random() * (max - min) + min);
    }
    getRowArray(row) {
        return this.data[row];
    }
    getColArray(col) {
        return this.data.map(row => row[col]);
    }
    toArray() {
        return this.data;
    }
    flatten() {
        const c = [];
        this.data.forEach(row => row.forEach(col => c.push(col)));
        return c;
    }
    map(func) {
        const c = Matrix.copy(this);
        c.data = c.data.map((row, i) => row.map((col, j) => func(col, i, j)));
        return c;
    }
    multiply(b) {
        if (b instanceof Matrix) {
            const t = Matrix.copy(this);
            const c = Matrix.zeros(this.n, b.m);
            return c.map((_, i, j) => dot(t.getRowArray(i), b.getColArray(j)));
        }
        else {
            return this.map(val => val * b.data);
        }
    }
    hadamard(b) {
        const t = Matrix.copy(this);
        return t.map((_, i, j) => t.data[i][j] * b.data[i][j]);
    }
    add(b) {
        if (b instanceof Matrix) {
            return this.map((val, i, j) => val + b.data[i][j]);
        }
        else {
            return this.map(val => val + b.data);
        }
    }
    subtract(b) {
        if (b instanceof Matrix) {
            return this.add(b.multiply(new Constant(-1)));
        }
        else {
            return this.map(val => val - b.data);
        }
    }
    concat(b) {
        const t = Matrix.copy(this);
        const c = Matrix.zeros(this.n, this.m + b.m);
        return c.map((_, i, j) => {
            if (j >= t.m)
                return b.data[i][j - t.m];
            else
                return t.data[i][j];
        });
    }
    stack(b) {
        const t = Matrix.copy(this);
        const c = Matrix.zeros(this.n + b.n, this.m);
        return c.map((_, i, j) => {
            if (i >= t.n)
                return b.data[i - t.n][j];
            else
                return t.data[i][j];
        });
    }
    transpose() {
        const t = Matrix.copy(this);
        const c = Matrix.zeros(this.m, this.n);
        return c.map((_, i, j) => t.data[j][i]);
    }
    print() {
        console.table(this.data);
    }
}
exports.Matrix = Matrix;
class Constant {
    constructor(a) {
        this.data = a;
    }
    multiply(b) {
        if (b instanceof Matrix) {
            return b.multiply(this);
        }
        else {
            return new Constant(this.data * b.data);
        }
    }
    add(b) {
        if (b instanceof Matrix) {
            return b.add(this);
        }
        else {
            return new Constant(this.data + b.data);
        }
    }
    subtract(b) {
        if (b instanceof Matrix) {
            return b.subtract(this).multiply(new Constant(-1));
        }
        else {
            return new Constant(this.data - b.data);
        }
    }
}
exports.Constant = Constant;
function dot(x, y) {
    return x.map((_, i) => x[i] * y[i]).reduce((a, b) => a + b);
}
