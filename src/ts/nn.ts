import { Matrix, Constant } from "./matrix";

export class NeuralNetwork {
  layers: Array<Object>;
  hidden_layers: number;
  alpha: number;

  constructor(structure: Object) {
    this.hidden_layers = structure["hidden_layers"];
    this.alpha = structure["alpha"];
    const hidden_layers: number = structure["hidden_layers"];
    const input_nodes: number = structure["input_nodes"];
    const hidden_nodes: number = structure["hidden_nodes"];
    const output_nodes: number = structure["output_nodes"];
    this.layers = Array(hidden_layers + 1).fill(new Object());
    this.layers = this.layers.map((layer, i, arr) => {
      if (i == 0) {
        layer["weights"] = Matrix.random(hidden_nodes, input_nodes, -1, 1);
        layer["biases"] = Matrix.random(hidden_nodes, 1, -1, 1);
      } else if (i == hidden_layers) {
        layer["weights"] = Matrix.random(output_nodes, hidden_nodes, -1, 1);
        layer["biases"] = Matrix.random(output_nodes, 1, -1, 1);
      } else {
        layer["weights"] = Matrix.random(hidden_nodes, hidden_nodes, -1, 1);
        layer["biases"] = Matrix.random(hidden_nodes, 1, -1, 1);
      }
      return layer;
    });
  }

  test(input: Array<number>): Array<Array<number>> {
    const og: Array<number> = input;
    const activations: Array<Array<number>> = this.layers.map(layer => {
      const i: Matrix = Matrix.vector(input);
      const logits: Matrix = (<Matrix>layer["weights"]).multiply(i);
      const logits_plus_bias: Matrix = (<Matrix>layer["biases"]).add(logits);
      const activation: Matrix = logits_plus_bias.map(val => sigmoid(val));
      input = activation.flatten();
      return input;
    });
    return [og, ...activations];
  }

  // propagates error of activations backwards through the network from ouput nodes to input nodes
  private static propError(nn: NeuralNetwork, activations: Array<Array<number>>, input: Array<number>, target: Array<number>): Array<Matrix>{
    let previous_error: Matrix = null;
    return activations.map((activation: Array<number>, index: number) => {
      const wb_index: number = nn.hidden_layers - index - 1;
      if (index == 0) { // if output layer
        const target_vector: Matrix = Matrix.vector(target);
        const activation_vector: Matrix = Matrix.vector(activation);
        const output_error: Matrix = target_vector.subtract(activation_vector);
        previous_error = output_error;
        return output_error;
      } else {
        const weights: Matrix = nn.layers[wb_index]["weights"];
        const propagated_error: Matrix = weights
          .transpose()
          .multiply(previous_error);
        previous_error = propagated_error;
        return propagated_error;
      }
    });
  }

  private static dWeightsBiases(nn: NeuralNetwork, nn_error: Array<Matrix>, activations: Array<Array<number>>): Array<Array<Matrix>> {
    return nn_error.slice(0, nn_error.length - 1).map((a_error: Matrix, index: number) => {
        const activation = Matrix.vector(activations[index]);
        const pactivation = Matrix.vector(activations[index + 1]);
        const dBias = a_error
          .hadamard(derivative(activation))
          .multiply(new Constant(nn.alpha));
        const dWeight = dBias.multiply(pactivation.transpose());
        return [dWeight, dBias];
      });
  }

  private static nudge(nn: NeuralNetwork, nudges: Array<Array<Matrix>>) {
    nudges.forEach(([dW, dB], index: number) => {
      const wb_index: number = nn.hidden_layers - index - 1;
      const weights: Matrix = nn.layers[wb_index]['weights'];
      const biases: Matrix = nn.layers[wb_index]['biases'];
      nn.layers[wb_index]['weights'] = weights.add(dW);
      nn.layers[wb_index]['biases'] = biases.add(dB);
    });
  }

  train(input: Array<number>, target: Array<number>) {
    const t: Array<Array<number>> = this.test(input);
    const rt: Array<Array<number>> = t.reverse();
    const network_error = NeuralNetwork.propError(this, rt, input, target);
    const deltaWeightsBiases = NeuralNetwork.dWeightsBiases(this, network_error, rt);
    NeuralNetwork.nudge(this, deltaWeightsBiases);
  }
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

function derivative(v: Matrix) {
  const inverse: Matrix = <Matrix>new Constant(1).subtract(v);
  return v.hadamard(inverse);
}
