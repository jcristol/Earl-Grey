let brain;
import { NeuralNetwork } from "./nn";
import "p5";

let nn;

function xor(a, b) {
  if (a && b) {
    return 0;
  }
  if (!a && !b) {
    return 0;
  }
  return 1;
}

function and(a, b) {
  if (a && b) {
    return 1;
  }
  return 0;
}

function genSampleXOR(s) {
  return Array(s)
    .fill(null)
    .map(() => {
      const a = Math.floor(Math.random() * 2);
      const b = Math.floor(Math.random() * 2);
      const r = xor(a, b);
      const input = [a, b];
      const target = [r];
      return [input, target];
    });
}

function genSampleAND(s) {
  return Array(s)
    .fill(null)
    .map(() => {
      const a = Math.floor(Math.random() * 2);
      const b = Math.floor(Math.random() * 2);
      const r = and(a, b);
      const input = [a, b];
      const target = [r];
      return [input, target];
    });
}

window.setup = function() {
  nn = new NeuralNetwork(4, 2, 4, 1, 0.05);
  createCanvas(400, 400);
};

window.draw = function() {
  background(0);
  for (let i = 0; i < 250; i++) {
    const a = Math.floor(Math.random() * 2);
    const b = Math.floor(Math.random() * 2);
    const r = xor(a, b);
    const input = [a, b];
    const target = [r];
    nn.train(input, target);
  }
  let res = 5;
  let rows = height / res;
  let cols = width / res;
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      const a = i / cols;
      const b = j / rows;
      const input = [a, b];
      const y = nn.predict(input)[0];
      fill(y * 255);
      rect(i * res, j * res, res, res);
    }
  }
};
