let brain;
import { NeuralNetwork } from "./nn";
import "p5";

const structure = {
  alpha: 0.05,
  hidden_layers: 4,
  input_nodes: 2,
  hidden_nodes: 4,
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

function and(a, b) {
  if(a && b) {
    return 1;
  }
  return 0;
}

function genSampleXOR(s){
  return Array(s).fill(null).map(() => {
    const a = Math.floor(Math.random() * 2);
    const b = Math.floor(Math.random() * 2);
    const r = xor(a,b);
    const input = [a,b];
    const target = [r];
    return [input, target];
  });
}

function genSampleAND(s){
  return Array(s).fill(null).map(() => {
    const a = Math.floor(Math.random() * 2);
    const b = Math.floor(Math.random() * 2);
    const r = and(a,b);
    const input = [a,b];
    const target = [r];
    return [input, target];
  });
}

window.setup = function() {
  let samples = genSampleXOR(50000);
  let nn = new NeuralNetwork(structure);
  console.log("before training")
  console.log("input: 1,0 ouput: ",nn.test([1,0]).pop());
  console.log("input: 0,1 ouput: ",nn.test([0,1]).pop());
  console.log("input: 1,1 ouput: ",nn.test([1,1]).pop());
  console.log("input: 0,0 ouput: ",nn.test([0,0]).pop());
  samples.forEach(([input, target]) => {
    nn.train(input, target);
  });
  let input = [1, 0];
  let target = [1];
  console.log("after training")
  console.log("input: 1,0 ouput: ",nn.test([1,0]).pop());
  console.log("input: 0,1 ouput: ",nn.test([0,1]).pop());
  console.log("input: 1,1 ouput: ",nn.test([1,1]).pop());
  console.log("input: 0,0 ouput: ",nn.test([0,0]).pop());
};
