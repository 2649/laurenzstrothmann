import * as Jimp from "jimp";

export const jimpToImageArrays = (image: any) => {
  var imageBufferData = image.bitmap.data;

  const [redArray, greenArray, blueArray] = [
    new Array<number>(),
    new Array<number>(),
    new Array<number>(),
  ];

  for (let i = 0; i < imageBufferData.length; i += 4) {
    redArray.push(imageBufferData[i]);
    greenArray.push(imageBufferData[i + 1]);
    blueArray.push(imageBufferData[i + 2]);
  }

  return [redArray, greenArray, blueArray];
};

export const arraysToFloat32Data = (
  redArray: number[],
  blueArray: number[],
  greenArray: number[],
  dims: number[]
) => {
  const transposedData = redArray.concat(greenArray).concat(blueArray);
  let i,
    l = transposedData.length;
  const float32Data = new Float32Array(dims[1] * dims[2] * dims[3]);
  for (i = 0; i < l; i++) {
    float32Data[i] = transposedData[i];
  }
  return float32Data;
};

export const calcPaddingAfterResize = (
  targetDims: number[],
  originalDims: number[]
) => {
  const resizeFactorX = targetDims[0] / originalDims[0];
  const resizeFactorY = targetDims[1] / originalDims[1];

  var paddings: number[];

  if (resizeFactorX > resizeFactorY) {
    const fullPaddings = resizeFactorX * originalDims[1] - targetDims[0];
    const addOdd = fullPaddings % 2 === 0 ? 0 : 1;
    paddings = [
      0,
      0,
      Math.floor(fullPaddings / 2),
      Math.floor(fullPaddings / 2) + addOdd,
    ];
  } else {
    const fullPaddings = resizeFactorY * originalDims[0] - targetDims[1];
    const addOdd = fullPaddings % 2 === 0 ? 0 : 1;
    paddings = [
      Math.floor(fullPaddings / 2),
      Math.floor(fullPaddings / 2) + addOdd,
      0,
      0,
    ];
  }
  return paddings;
};
