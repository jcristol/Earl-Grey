"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const matrix_1 = require("./matrix");
class NeuralNetwork {
    constructor(structure) {
        this.hidden_layers = structure["hidden_layers"];
        this.alpha = structure["alpha"];
        const hidden_layers = structure["hidden_layers"];
        const input_nodes = structure["input_nodes"];
        const hidden_nodes = structure["hidden_nodes"];
        const output_nodes = structure["output_nodes"];
        this.layers = Array(hidden_layers + 1).fill(null);
        this.layers = this.layers.map((_, i, arr) => {
            const layer = {};
            if (i == 0) {
                layer["weights"] = matrix_1.Matrix.random(hidden_nodes, input_nodes, -1, 1);
                layer["biases"] = matrix_1.Matrix.random(hidden_nodes, 1, -1, 1);
            }
            else if (i == hidden_layers) {
                layer["weights"] = matrix_1.Matrix.random(output_nodes, hidden_nodes, -1, 1);
                layer["biases"] = matrix_1.Matrix.random(output_nodes, 1, -1, 1);
            }
            else {
                layer["weights"] = matrix_1.Matrix.random(hidden_nodes, hidden_nodes, -1, 1);
                layer["biases"] = matrix_1.Matrix.random(hidden_nodes, 1, -1, 1);
            }
            return layer;
        });
    }
    test(input) {
        const og = input;
        const activations = this.layers.map(layer => {
            const i = matrix_1.Matrix.vector(input);
            const logits = layer["weights"].multiply(i);
            const logits_plus_bias = logits.add(layer["biases"]);
            const activation = logits_plus_bias.map(val => sigmoid(val));
            input = activation.flatten();
            return input;
        });
        return [og, ...activations];
    }
    // propagates error of activations backwards through the network from ouput nodes to input nodes
    propagateError(activations, input, target) {
        let previous_error = null;
        return activations
            .slice(1, activations.length)
            .reverse()
            .map((activation, index) => {
            const wb_index = this.hidden_layers - index + 1;
            if (previous_error == null) {
                // if output 
                const target_vector = matrix_1.Matrix.vector(target);
                const activation_vector = matrix_1.Matrix.vector(activation);
                const output_error = target_vector.subtract(activation_vector);
                previous_error = output_error;
                return output_error;
            }
            else {
                const weights = this.layers[wb_index]["weights"];
                const propagated_error = weights
                    .transpose()
                    .multiply(previous_error);
                previous_error = propagated_error;
                return propagated_error;
            }
        });
    }
    dWeightsBiases(nn_error, activations) {
        return nn_error.map((a_error, index) => {
            const activation_index = this.hidden_layers - index + 1;
            const activation = matrix_1.Matrix.vector(activations[activation_index]);
            const pactivation = matrix_1.Matrix.vector(activations[activation_index - 1]);
            const dBias = a_error
                .hadamard(derivative(activation))
                .multiply(new matrix_1.Constant(this.alpha));
            const dWeight = dBias.multiply(pactivation.transpose());
            return [dWeight, dBias];
        });
    }
    nudge(nudges) {
        nudges.forEach(([dW, dB], index) => {
            const wb_index = this.hidden_layers - index;
            const weights = this.layers[wb_index]["weights"];
            const biases = this.layers[wb_index]["biases"];
            this.layers[wb_index]["weights"] = weights.add(dW);
            this.layers[wb_index]["biases"] = biases.add(dB);
        });
    }
    train(input, target) {
        const activations = this.test(input);
        const network_error = this.propagateError(activations, input, target);
        const deltaWeightsBiases = this.dWeightsBiases(network_error, activations);
        this.nudge(deltaWeightsBiases);
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
