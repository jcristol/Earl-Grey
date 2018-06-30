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

  train(inputs: Array<Array<number>>, targets: Array<Array<number>>) {
    inputs.forEach((input, trial) => {
      let previous_error: Matrix = null;
      const trial_target: Array<number> = targets[trial];
      const out_to_in_activations: Array<Array<number>> = this.test(
        input
      ).reverse();
      const out_to_in_error: Array<Matrix> = out_to_in_activations.map(
        (activation: Array<number>, index: number) => {
          const weight_bias_index: number = this.hidden_layers - index - 1;
          if (index == 0) {
            const output_error: Matrix = Matrix.vector(trial_target).subtract(
              Matrix.vector(activation)
            );
            previous_error = output_error;
            return output_error;
          } else {
            const weights: Matrix = this.layers[weight_bias_index]["weights"];
            const propagated_error: Matrix = weights
              .transpose()
              .multiply(previous_error);
            previous_error = propagated_error;
            return propagated_error;
          }
        }
      );
      const deltaWeights = out_to_in_error
        .slice(0, out_to_in_error.length - 1)
        .map((l_error: Matrix, index: number) => {
          const activation: Matrix = Matrix.vector(
            out_to_in_activations[index]
          );
          const previous_activation: Matrix = Matrix.vector(
            out_to_in_activations[index + 1]
          );
          const deltaWeight: Matrix = l_error
            .hadamard(derivative(activation))
            .multiply(new Constant(this.alpha))
            .multiply(previous_activation.transpose());
          return deltaWeight;
        });
    });
  }
}

function sigmoid(x: number) {
  return 1 / (1 + Math.exp(-x));
}

function derivative(v: Matrix) {
  const inverse: Matrix = <Matrix>new Constant(1).subtract(v);
  return v.hadamard(inverse);
}
