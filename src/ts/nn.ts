import { Tensor } from "./tensor";

const l = new Tensor(2, 2);
const arr1 = l.toArray();
arr1[0][0] = 2;
console.log(arr1)
console.log(l.toArray());


// export class NeuralNetwork {
// }

// import { Matrix, Vector } from "./matrix";

// export class NeuralNetwork {
//   levels: number;
//   input_nodes: number;
//   hidden_nodes: number;
//   output_nodes: number;
//   weights: Array<any>;

//   constructor(input_nodes: number, hidden_nodes: number, output_nodes: number) {
//     this.input_nodes = input_nodes;
//     this.hidden_nodes = hidden_nodes;
//     this.output_nodes = output_nodes;
//     this.levels = 2;
//     this.weights = Array(this.levels).fill(null);
//     this.weights[0] = Matrix.concat(
//       Matrix.random(hidden_nodes, input_nodes, -1, 1),
//       Vector.random(hidden_nodes, -1, 1)
//     );
//     this.weights[1] = Matrix.concat(
//       Matrix.random(output_nodes, hidden_nodes, -1, 1),
//       Vector.random(output_nodes, -1, 1)
//     );
//   }

//   feedForward(input: Array<number>) {
//     return this.weights.map((matrix: Matrix, index: number) => {
//       const inputVector: Vector = Matrix.stack(
//         new Vector(input),
//         new Vector([1])
//       );
//       const preFunc: Vector = Matrix.multiply(matrix, inputVector);
//       const activation: Vector = preFunc.map(
//         (t, i, j) => sigmoid(t.tensor[i][j]),
//         preFunc
//       );
//       input = Vector.toArray(activation);
//       return input;
//     });
//   }

//   train(inputs, targets) {
//     const inputVector: Vector = new Vector(inputs);
//     const results = this.feedForward(inputs);
//     const outputs: Vector = new Vector(results[1]);
//     const hiddens: Vector = new Vector(results[0]);
//     const targetsMatrix: Vector = new Vector(targets);

//     // Calculate the error
//     // Error = TARGETS - OUTPUTS
//     const output_errors: Matrix = Matrix.subtract(targetsMatrix, outputs);
//     const weight_deltas_ho = Matrix.multiply(
//       Matrix.multiplicationElemWise(
//         output_errors,
//         derivative(outputs)
//       ).multiply(0.001),
//       hiddens.transpose()
//     );

//     // hopefully this is right
//     this.weights[1] = Matrix.add(this.weights[1], weight_deltas_ho);

//     //Calculate the hidden errors
//     const hidden_weights_trans: Matrix = this.weights[1].transpose();
//     const hidden_errors: Matrix = Matrix.multiply(
//       hidden_weights_trans,
//       output_errors
//     );
//     const weight_deltas_ih = Matrix.multiply(
//       Matrix.multiplicationElemWise(
//         hidden_errors,
//         derivative(hiddens)
//       ).multiply(0.001),
//       inputVector.transpose()
//     );

//     // hopefully this is right
//     this.weights[0] = Matrix.add(this.weights[0], weight_deltas_ih);
//   }
// }

// function sigmoid(x: number) {
//   return 1 / (1 + Math.exp(-x));
// }

// function derivative(v: Vector) {
//   return Matrix.multiplicationElemWise(v, v.multiply(-1).add(1));
// }
