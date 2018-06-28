import { Tensor } from "../src/ts/tensor";
import { expect } from "chai";
import "mocha";

const std_dimensions: Array<number> = [2];

function validate_dimensions(t: Tensor, d: Array<number>): boolean {
  if(t.data instanceof Array) {
    const valid_children: boolean = t.data.every(child => validate_dimensions(child, d.slice(1)))
    return valid_children && d[0] === t.dimensions[0];
  }
  return t.dimensions.length === d.length;
}

function validate_copy(a: Tensor, b: Tensor): boolean {
  if(a.data instanceof Array && b.data instanceof Array ) {
    const valid_children_a: boolean = a.data.every((child, index) => validate_copy(child, b.data[index]));
    const valid_children_b: boolean = b.data.every((child, index) => validate_copy(child, a.data[index]));
    return valid_children_a && valid_children_b
  }
  return a.data === b.data;
}

describe("test tensor utility functions", () => {

  it("validate dimensions", () => {
    const a: Tensor = Tensor.zeros(...std_dimensions);
    expect(validate_dimensions(a, std_dimensions)).to.be.true;
  });

  it("validate copy is exactly the same for all zeros", () => {
    const a: Tensor = Tensor.zeros(...std_dimensions);
    const b: Tensor = Tensor.zeros(...std_dimensions);
    expect(validate_copy(a,b)).to.be.true;
  });

  it("validate copy is different for different tensors", () => {
    const a: Tensor = Tensor.zeros(...std_dimensions);
    const b: Tensor = Tensor.zeros(...std_dimensions).map(() => 1);
    expect(validate_copy(a,b)).to.be.false;
  });

  it("validate copy is distinct from src", () => {
    // const a: Tensor = Tensor.zeros(...std_dimensions);
    // expect(validate_dimensions(a, std_dimensions)).to.be.true;
  });

});