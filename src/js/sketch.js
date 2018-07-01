let brain;
import { NeuralNetwork } from "./nn";
import "p5";

const structure = {
  alpha: 0.01,
  hidden_layers: 1,
  input_nodes: 2,
  hidden_nodes: 2,
  output_nodes: 1
};

function xor(a, b) {
  if(a && b) {
    return 0;
  }
  if(!a && !b) {
    return 0;
  }
  return 1;
}

function genSample(s){
  return Array(s).fill(null).map(() => {
    const a = Math.floor(Math.random() * 2);
    const b = Math.floor(Math.random() * 2);
    const r = xor(a,b);
    const input = [a,b];
    const target = [r];
    return [input, target];
  });
}

window.setup = function() {
  let samples = genSample(1000);
  let nn = new NeuralNetwork(structure);
  samples.forEach(([input, target]) => {
    nn.train(input, target);
  });
  let input = [1, 0];
  let target = [1];
  console.log(nn.test([1,0]).pop());
  console.log(nn.test([0,1]).pop());
  console.log(nn.test([1,1]).pop());
  console.log(nn.test([0,0]).pop());
};
