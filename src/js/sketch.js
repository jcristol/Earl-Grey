let brain;
import { NeuralNetwork } from "./nn";
import "p5";

const structure = {
  alpha: 0.01,
  hidden_layers: 1,
  input_nodes: 2,
  hidden_nodes: 2,
  output_nodes: 2
};

window.setup = function() {
  let nn = new NeuralNetwork(structure);
  let inputs = [1, 0];
  let output = nn.test(input);
  // let targets = [1,0];
  // nn.train(inputs, targets);
  console.log(output);
};
