import { bboxAnnotationObject } from "./types";
import * as Jimp from "jimp";

export const jimpToImageArrays = (image: Jimp) => {
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

  if (resizeFactorX < resizeFactorY) {
    const fullPaddings = targetDims[0] - resizeFactorX * originalDims[1];
    const addOdd = Math.floor(fullPaddings) % 2 === 0 ? 0 : 1;
    paddings = [
      0,
      0,
      Math.floor(fullPaddings / 2),
      Math.floor(fullPaddings / 2) + addOdd,
    ];
  } else {
    const fullPaddings = targetDims[1] - resizeFactorY * originalDims[0];
    const addOdd = Math.floor(fullPaddings) % 2 === 0 ? 0 : 1;
    paddings = [
      Math.floor(fullPaddings / 2),
      Math.floor(fullPaddings / 2) + addOdd,
      0,
      0,
    ];
  }
  return paddings;
};

const calcIoU = (bbox1: number[], bbox2: number[]) => {
  const xLeft = Math.max(bbox1[0], bbox2[0]);
  const yTop = Math.max(bbox1[1], bbox2[1]);
  const xRight = Math.min(bbox1[0] + bbox1[2], bbox2[0] + bbox2[2]);
  const yBottom = Math.min(bbox1[1] + bbox1[3], bbox2[1] + bbox2[3]);

  if (xRight < xLeft || yBottom < yTop) {
    return 0;
  }

  const intersectionArea = (xRight - xLeft) * (yBottom - yTop);

  const bbox1Area = bbox1[2] * bbox1[3];
  const bbox2Area = bbox2[2] * bbox2[3];

  return intersectionArea / (bbox1Area + bbox2Area - intersectionArea);
};

export const nonMaximumSupression = (
  bboxes: bboxAnnotationObject[],
  iouThreshold: number = 0.5
): bboxAnnotationObject[] => {
  let keepBbox: boolean;
  return bboxes.filter((el, idx) => {
    keepBbox = true;
    bboxes.forEach((innerEl, innerIdx) => {
      if (
        calcIoU(el.box, innerEl.box) > iouThreshold &&
        el.score < innerEl.score
      ) {
        keepBbox = false;
      }
    });
    return keepBbox;
  });
};
