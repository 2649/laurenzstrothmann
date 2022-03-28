import { TypedTensor } from "onnxruntime-web";
import * as Jimp from "jimp";
import { sigmoid, softmax } from "../util/math";
import { bboxAnnotationObject, anyAnnoationObject } from "../util/types";
import InferenceBase from "./inference";
import {
  calcPaddingAfterResize,
  nonMaximumSupression,
} from "../util/imageProcess";
import { v4 as uuidv4 } from "uuid";

class TinyYoloV2 extends InferenceBase {
  classes: string[];
  anchors: number[];
  modelName: string;
  classesColor: string[];

  constructor() {
    const modelSrc = process.env.PUBLIC_URL + "/tinyyolov2-8.onnx";
    const dims = [1, 3, 416, 416];
    const executionProvider = ["webgl"];

    super(modelSrc, dims, executionProvider);

    this.modelName = "Tiny Yolo V2";
    this.classes = [
      "aeroplane",
      "bicycle",
      "bird",
      "boat",
      "bottle",
      "bus",
      "car",
      "cat",
      "chair",
      "cow",
      "diningtable",
      "dog",
      "horse",
      "motorbike",
      "person",
      "pottedplant",
      "sheep",
      "sofa",
      "train",
      "tvmonitor",
    ];
    this.classesColor = [
      "#e6194b",
      "#3cb44b",
      "#ffe119",
      "#4363d8",
      "#f58231",
      "#911eb4",
      "#46f0f0",
      "#f032e6",
      "#bcf60c",
      "#fabebe",
      "#008080",
      "#e6beff",
      "#9a6324",
      "#fffac8",
      "#800000",
      "#aaffc3",
      "#808000",
      "#ffd8b1",
      "#000075",
      "#109101",
      "#ffffff",
      "#000000",
    ];
    this.anchors = [
      1.08, 1.19, 3.42, 4.41, 6.63, 11.38, 9.42, 5.11, 16.62, 10.52,
    ];
  }

  preprocess(jimpImage: Jimp): Jimp {
    return jimpImage.contain(this.dims[2], this.dims[3]);
  }

  postprocess(
    output: TypedTensor<"float32">,
    inputImage: Jimp
  ): anyAnnoationObject[] {
    // Expected dims of output: [1, 125, 13, 13]
    console.time("Postprocess time");

    // Prepare variables for loops and processing
    var [offset, anchorX, anchorY, anchorId, bboxIdx] = [0, 0, 0, 0, 0];
    const stepSize = 13 * 13;
    const paddings = calcPaddingAfterResize(
      [this.dims[2], this.dims[3]],
      [inputImage.getWidth(), inputImage.getHeight()]
    );
    var outputBoxes: bboxAnnotationObject[] = [];

    // We will use the indexes to splice the FloatArray and extract all bboxes
    for (anchorY; anchorY < 13; anchorY++) {
      anchorX = 0;
      for (anchorX; anchorX < 13; anchorX++) {
        var currentBboxList: number[] = [];
        anchorId = 0;
        for (anchorId; anchorId < 125; anchorId++) {
          currentBboxList.push(output.data[anchorId * stepSize + offset]);
        }
        bboxIdx = 0;
        for (bboxIdx; bboxIdx < 5; bboxIdx++) {
          var currentBbox = currentBboxList.splice(0, 25);
          const currentC = sigmoid(currentBbox[4]);
          if (currentC > 0.3) {
            // Actual processing of bbox
            const softmaxOut = softmax(
              currentBbox.slice(5, currentBbox.length)
            );
            const className =
              this.classes[softmaxOut.indexOf(Math.max(...softmaxOut))];
            const classColor =
              this.classesColor[softmaxOut.indexOf(Math.max(...softmaxOut))];

            const width = //@ts-ignore
              Math.exp(currentBbox[2]) * this.anchors[bboxIdx * 2] * 32;
            const height = //@ts-ignore
              Math.exp(currentBbox[3]) * this.anchors[bboxIdx * 2 + 1] * 32;
            var bbox = [
              ((sigmoid(currentBbox[0]) + anchorX) * 32 - width / 2) /
                this.dims[2],
              ((sigmoid(currentBbox[1]) + anchorY) * 32 - height / 2) /
                this.dims[3],
              width / (this.dims[2] - paddings[0] - paddings[1]),
              height / (this.dims[3] - paddings[2] - paddings[3]),
            ];

            bbox = [
              Math.min(Math.max(bbox[0], 0), 1),
              Math.min(Math.max(bbox[1], 0), 1),
              Math.min(Math.max(bbox[2], 0), 1),
              Math.min(Math.max(bbox[3], 0), 1),
            ];

            outputBoxes.push({
              className: className,
              color: classColor,
              id: uuidv4(),
              score: currentC,
              model: this.modelName,
              type: "bbox",
              box: bbox,
            });
          }
        }
        offset++;
      }
    }
    console.timeEnd("Postprocess time");

    return nonMaximumSupression(outputBoxes);
  }
}

export const tinyYoloV2Executor = new TinyYoloV2();
tinyYoloV2Executor.loadModel();
