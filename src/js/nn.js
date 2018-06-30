"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matrix_1 = require("./matrix");
class NeuralNetwork {
    constructor(structure) {
        this.hidden_layers = structure['hidden_layers'];
        this.alpha = structure['alpha'];
        const hidden_layers = structure['hidden_layers'];
        const input_nodes = structure['input_nodes'];
        const hidden_nodes = structure['hidden_nodes'];
        const output_nodes = structure['output_nodes'];
        this.layers = Array(hidden_layers + 1).fill(new Object());
        this.layers = this.layers.map((layer, i, arr) => {
            if (i == 0) {
                layer['weights'] = matrix_1.Matrix.random(hidden_nodes, input_nodes, -1, 1);
                layer['biases'] = matrix_1.Matrix.random(hidden_nodes, 1, -1, 1);
            }
            else if (i == hidden_layers) {
                layer['weights'] = matrix_1.Matrix.random(output_nodes, hidden_nodes, -1, 1);
                layer['biases'] = matrix_1.Matrix.random(output_nodes, 1, -1, 1);
            }
            else {
                layer['weights'] = matrix_1.Matrix.random(hidden_nodes, hidden_nodes, -1, 1);
                layer['biases'] = matrix_1.Matrix.random(hidden_nodes, 1, -1, 1);
            }
            return layer;
        });
    }
    test(input) {
        const og = input;
        const activations = this.layers.map(layer => {
            const i = matrix_1.Matrix.vector(input);
            const logits = layer['weights'].multiply(i);
            const logits_plus_bias = layer['biases'].add(logits);
            const activation = logits_plus_bias.map(val => sigmoid(val));
            input = activation.flatten();
            return input;
        });
        return [og, ...activations];
    }
    train(inputs, targets) {
        inputs.forEach((input, trial) => {
            let previous_error = null;
            const trial_target = targets[trial];
            const out_to_in_activations = this.test(input).reverse();
            const out_to_in_error = out_to_in_activations.map((activation, index) => {
                const weight_bias_index = this.hidden_layers - index - 1;
                if (index == 0) {
                    const output_error = matrix_1.Matrix.vector(trial_target).subtract(matrix_1.Matrix.vector(activation));
                    previous_error = output_error;
                    return output_error;
                }
                else {
                    const weights = this.layers[weight_bias_index]['weights'];
                    const propagated_error = weights.transpose().multiply(previous_error);
                    previous_error = propagated_error;
                    return propagated_error;
                }
            });
            const deltaWeights = out_to_in_error.slice(0, out_to_in_error.length - 1).map((l_error, index) => {
                const activation = matrix_1.Matrix.vector(out_to_in_activations[index]);
                const previous_activation = matrix_1.Matrix.vector(out_to_in_activations[index + 1]);
                const deltaWeight = l_error
                    .hadamard(derivative(activation))
                    .multiply(new matrix_1.Constant(this.alpha))
                    .multiply(previous_activation.transpose());
                return deltaWeight;
            });
        });
    }
}
exports.NeuralNetwork = NeuralNetwork;
function sigmoid(x) {
    return 1 / (1 + Math.exp(-x));
}
function derivative(v) {
    const inverse = new matrix_1.Constant(1).subtract(v);
    return v.hadamard(inverse);
}
