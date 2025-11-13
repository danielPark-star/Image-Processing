import assert from "assert";
import { Color, Image } from "../include/image.js";
import {
  imageMapCoord,
  imageMapIf,
  mapWindow,
  isGrayish,
  makeGrayish,
  pixelBlur,
  imageBlur,
} from "./imageProcessingHOF.js";

// Helper function to check if a color is equal to another one with an error of 1 (default)
function expectColorToBeCloseTo(actual: Color, expected: Color, error = 1) {
  [0, 1, 2].forEach(i => expect(Math.abs(actual[i] - expected[i])).toBeLessThanOrEqual(error));
}

describe("imageMapCoord", () => {
  function sameColor(img: Image, x: number, y: number) {
    return img.getPixel(x, y);
  }

  it("should return a different image", () => {
    const input = Image.create(10, 10, [0, 0, 0]);
    const output = imageMapCoord(input, sameColor);
    assert(input !== output);
  });

  it("should change color correctly", () => {
    const input = Image.create(5, 5, [3, 3, 3]);
    const expected = Image.create(5, 5, [200, 200, 200]);
    const output = imageMapCoord(input, () => [200, 200, 200]);
    expect(expected).toEqual(output);
  });
  // More tests for imageMapCoord go here.
});

describe("imageMapIf", () => {
  // More tests for imageMapIf go here
  it("should not change if true", () => {
    const input = Image.create(10, 10, [2, 2, 2]);
    const expected = Image.create(10, 10, [2, 2, 2]);
    function sameColor(p: Color) {
      return p;
    }
    const output = imageMapIf(input, () => true, sameColor);
    expect(expected).toEqual(output);
  });

  it("should change color if false", () => {
    const input = Image.create(2, 2, [255, 0, 0]);
    const expected = Image.create(2, 2, [255, 0, 0]);
    function toBlack(p: Color) {
      p[0] = 255;
      p[1] = 255;
      p[2] = 255;
      return p;
    }
    const output = imageMapIf(input, () => false, toBlack);
    expect(expected).toEqual(output);
  });
});

describe("mapWindow", () => {
  // More tests for mapWindow go here
  function sameColor(p: Color) {
    return p;
  }
  function setBlueMax(p: Color) {
    p[0] = 0;
    p[1] = 0;
    p[2] = 255;
    return p;
  }
  it("should return a different image", () => {
    const input = Image.create(3, 3, [30, 30, 30]);
    const output = mapWindow(input, [0, 2], [0, 2], sameColor);
    assert(input !== output);
    expect(input).toEqual(output);
  });

  it("should return an image in the interval", () => {
    const input = Image.create(5, 5, [30, 30, 30]);
    const output = mapWindow(input, [0, 4], [0, 4], setBlueMax);
    const expected = Image.create(5, 5, [0, 0, 255]);
    expect(expected).toEqual(output);
  });

  it("set new interval if x is out of bounds", () => {
    const input = Image.create(5, 5, [30, 30, 30]);
    const output = mapWindow(input, [-232, 70], [0, 4], setBlueMax);
    const expected = Image.create(5, 5, [0, 0, 255]);
    expect(expected).toEqual(output);
  });

  it("set new interval if y is out of bounds", () => {
    const input = Image.create(5, 5, [30, 30, 30]);
    const output = mapWindow(input, [0, 4], [-234, 42489], setBlueMax);
    const expected = Image.create(5, 5, [0, 0, 255]);
    expect(expected).toEqual(output);
  });

  it("set new interval if x, y is out of bounds", () => {
    const input = Image.create(5, 5, [30, 30, 30]);
    const output = mapWindow(input, [-2342, 43443], [-234, 42489], setBlueMax);
    const expected = Image.create(5, 5, [0, 0, 255]);
    expect(expected).toEqual(output);
  });
});

describe("isGrayish", () => {
  // More tests for isGrayish go here
  it("return true or false", () => {
    const arr1 = [0, 0, 0];
    const arr2 = [255, 255, 255];
    const arr3 = [255, 200, 233];
    const arr4 = [255, 10, 130];
    assert(isGrayish(arr1));
    assert(isGrayish(arr2));
    assert(isGrayish(arr3));
    assert(!isGrayish(arr4));
  });

  it("return true for 85 and false for 86", () => {
    const arr85 = [85, 0, 0];
    const arr86 = [86, 0, 0];
    assert(isGrayish(arr85));
    assert(!isGrayish(arr86));
  });
});

describe("makeGrayish", () => {
  // More tests for makeGrayish go here
  function sameColor(img: Image, x: number, y: number) {
    return img.getPixel(x, y);
  }
  it("should return a different image", () => {
    const input = Image.create(10, 10, [0, 0, 0]);
    const output = imageMapCoord(input, sameColor);
    assert(input !== output);
  });

  it("should not modify colors if isGrayish is false", () => {
    const input = Image.create(10, 10, [120, 0, 0]);
    const output = makeGrayish(input);
    const expected = Image.create(10, 10, [40, 40, 40]);
    expect(expected).toEqual(output);
  });

  it("should make grayish if isGrayish is true", () => {
    const input = Image.create(10, 10, [10, 10, 10]);
    const output = makeGrayish(input);
    const expected = Image.create(10, 10, [10, 10, 10]);
    expect(expected).toEqual(output);
  });

  it("should make grayish if isGrayish is false 2", () => {
    const input = Image.create(10, 10, [200, 0, 0]);
    const output = makeGrayish(input);
    const expected = Image.create(10, 10, [66, 66, 66]);
    expect(expected).toEqual(output);
    const color1 = output.getPixel(1, 1);
    const expectedColor = [66, 66, 66];
    expectColorToBeCloseTo(color1, expectedColor);
  });
});

describe("pixelBlur", () => {
  // Tests for pixelBlur go here
  it("should make pixelBlur the top right", () => {
    const input = Image.create(2, 2, [0, 0, 0]);
    input.setPixel(1, 1, [200, 200, 200]);
    const color1 = pixelBlur(input, 1, 1);
    const expected = [50, 50, 50];
    expect(expected).toEqual(color1);
    expectColorToBeCloseTo(color1, expected);
  });

  it("should make pixelBlur if all color is same", () => {
    const input = Image.create(7, 7, [10, 10, 10]);
    const color1 = pixelBlur(input, 1, 1);
    const expected = [10, 10, 10];
    expect(expected).toEqual(color1);
    expectColorToBeCloseTo(color1, expected);
  });

  it("should make pixelBlur the bottom right and top right", () => {
    const input = Image.create(3, 3, [0, 0, 0]);
    input.setPixel(2, 0, [200, 200, 200]);
    const color1 = pixelBlur(input, 2, 0);
    const color2 = pixelBlur(input, 2, 2);
    const expected1 = [50, 50, 50];
    const expected2 = [0, 0, 0];
    expect(expected1).toEqual(color1);
    expectColorToBeCloseTo(color1, expected1);
    expect(expected2).toEqual(color2);
    expectColorToBeCloseTo(color2, expected2);
  });
});

describe("imageBlur", () => {
  // Tests for imageBlur go here
  it("should return a different image", () => {
    const input = Image.create(3, 3, [20, 20, 20]);
    const output = imageBlur(input);
    assert(input !== output);
  });

  it("should make an image Blur if all color is same", () => {
    const input = Image.create(7, 7, [10, 10, 10]);
    const output = imageBlur(input);
    const expected = Image.create(7, 7, [10, 10, 10]);
    expect(expected).toEqual(output);
  });

  it("should make an image Blur", () => {
    const input = Image.create(3, 3, [100, 100, 100]);
    input.setPixel(1, 1, [0, 0, 0]);
    const expected = Image.create(3, 3, [0, 0, 0]);
    expected.setPixel(0, 0, [75, 75, 75]);
    expected.setPixel(0, 1, [83, 83, 83]);
    expected.setPixel(0, 2, [75, 75, 75]);
    expected.setPixel(1, 0, [83, 83, 83]);
    expected.setPixel(1, 1, [88, 88, 88]);
    expected.setPixel(1, 2, [83, 83, 83]);
    expected.setPixel(2, 0, [75, 75, 75]);
    expected.setPixel(2, 1, [83, 83, 83]);
    expected.setPixel(2, 2, [75, 75, 75]);
    const output = imageBlur(input);
    expect(expected).toEqual(output);
  });
});
