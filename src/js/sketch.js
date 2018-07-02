let brain;
import { NeuralNetwork } from "./nn";
import "p5";
import "p5/lib/addons/p5.dom";

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

function training_data(func, ...inputs) {
  const input = [...inputs];
  const target = [func(...inputs)];
  return [input, target];
}

function train_loop() {
  for (let i = 0; i < 100; i++) {
    nn.train(
      ...training_data(
        xor,
        Math.floor(Math.random() * 2),
        Math.floor(Math.random() * 2)
      )
    );
  }
}

window.setup = function() {
  nn = new NeuralNetwork(3, 2, 4, 1, 0.05);
  createCanvas(400, 400);
};

window.draw = function() {
  train_loop();
  background(0);
  let res = 8;
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
