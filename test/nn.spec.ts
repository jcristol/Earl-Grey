import { expect } from "chai";
import "mocha";
import { NeuralNetwork } from "../src/js/nn";

function genDimension(seed: number) {
  return [
    Math.floor(Math.random() * seed + 1),
    Math.floor(Math.random() * seed + 1),
    Math.floor(Math.random() * seed + 1),
    Math.floor(Math.random() * seed + 1),
    Math.floor(Math.random())
  ]
}

function genInputs(inputs: number) {
  return Array(inputs).fill(null).map(() => Math.random());
}

function genTargets(targets: number) {
  return Array(targets).fill(null).map(() => Math.random());
}

describe("nn test general functionality", () => {
  it("make sure you get the correct result dimenisons", () => {
    const d = genDimension(5);
    const nn = new NeuralNetwork(...d);
    const [layers, inputs, hiddens, outputs, alpha] = d;
    const output: Array<number> = nn.test(genInputs(inputs)).pop();
    expect(output.length).to.be.equal(outputs);
    nn.train(genInputs(inputs), genTargets(outputs));
    expect(output.length).to.be.equal(outputs);
    // expect(["0", 1]).to.be.an('array').that.does.not.have(NaN.toString());
  });
});
