import type { Image, Color } from "../include/image.js";

export function imageMapCoord(img: Image, func: (img: Image, x: number, y: number) => Color): Image {
  // TODO
  const result = img.copy();
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      result.setPixel(i, j, func(img, i, j));
    }
  }
  return result;
}

export function imageMapIf(
  img: Image,
  cond: (img: Image, x: number, y: number) => boolean,
  func: (p: Color) => Color
): Image {
  // TODO
  const imageMapIfHelper = (img: Image, x: number, y: number) => {
    const color = img.getPixel(x, y);
    return cond(img, x, y) ? func(color) : color;
  };
  return imageMapCoord(img, imageMapIfHelper);
}

export function mapWindow(
  img: Image,
  xInterval: number[], // Assumed to be a two element array containing [x_min, x_max]
  yInterval: number[], // Assumed to be a two element array containing [y_min, y_max]
  func: (p: Color) => Color
): Image {
  // TODO
  const x_Min = xInterval[0] < 0 ? 0 : xInterval[0];
  const x_Max = xInterval[1] >= img.width ? img.width - 1 : xInterval[1];
  const y_Min = yInterval[0] < 0 ? 0 : yInterval[0];
  const y_Max = yInterval[0] >= img.height ? img.height - 1 : yInterval[1];

  if (x_Min > x_Max || y_Min > y_Max) {
    return img.copy();
  }
  function inInterval(img: Image, x: number, y: number) {
    return x >= x_Min && x <= x_Max && y >= y_Min && y <= y_Max;
  }
  return imageMapIf(img, inInterval, func);
}

export function isGrayish(p: Color): boolean {
  // TODO
  const a = Math.max(p[0], p[1], p[2]);
  const b = Math.min(p[0], p[1], p[2]);
  if (a - b > 85) {
    return false;
  }
  return true;
}

export function makeGrayish(img: Image): Image {
  // TODO
  const result = img.copy();
  for (let i = 0; i < img.width; i++) {
    for (let j = 0; j < img.height; j++) {
      const arr1 = img.getPixel(i, j);
      if (!isGrayish(arr1)) {
        const m = Math.floor((arr1[0] + arr1[1] + arr1[2]) / 3);
        const arr2 = [m, m, m];
        result.setPixel(i, j, arr2);
      }
    }
  }
  return result;
}

export function pixelBlur(img: Image, x: number, y: number): Color {
  // TODO
  const smallX = x - 1 < 0 ? x : x - 1;
  const bigX = x + 1 >= img.width ? x : x + 1;
  const smallY = y - 1 < 0 ? y : y - 1;
  const bigY = y + 1 >= img.height ? y : y + 1;
  let [sumRed, sumGreen, sumBlue] = [0, 0, 0];
  let count = 0;
  for (let x = smallX; x <= bigX; x++) {
    for (let y = smallY; y <= bigY; y++) {
      const p = img.getPixel(x, y);
      sumRed += p[0];
      sumGreen += p[1];
      sumBlue += p[2];
      count++;
    }
  }
  const newColor = [Math.floor(sumRed / count), Math.floor(sumGreen / count), Math.floor(sumBlue / count)];
  return newColor;
}

export function imageBlur(img: Image): Image {
  // TODO
  return imageMapCoord(img, (img, x, y) => pixelBlur(img, x, y));
}
