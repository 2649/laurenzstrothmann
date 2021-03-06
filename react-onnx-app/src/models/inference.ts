import { InferenceSession, Tensor, TypedTensor } from "onnxruntime-web";
import * as Jimp from "jimp";
import { anyAnnoationObject } from "../util/types";
import { arraysToFloat32Data, jimpToImageArrays } from "../util/imageProcess";

export class ModelStillLoadingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "ModelStillLoading";
  }
}

export class NotImplementedError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "NotImplementedError";
  }
}

export default class InferenceBase {
  modelSrc: string;
  modelFile: ArrayBuffer;
  executionProvider: string[];
  dims: number[];
  session: InferenceSession | undefined;
  loaded: boolean;
  error: boolean;

  constructor(modelSrc: string, dims: number[], executionProvider: string[]) {
    this.modelSrc = modelSrc;
    this.dims = dims;
    this.executionProvider = executionProvider;
    this.modelFile = new ArrayBuffer(0);
    this.session = undefined;
    this.loaded = false;
    this.error = false;
  }

  // Implemented functions
  preprocess(jimpImage: Jimp): Jimp {
    throw new NotImplementedError("The fn preprocess needs to be implemented");
  }

  postprocess(
    output: TypedTensor<"float32">,
    inputImage: Jimp
  ): anyAnnoationObject[] {
    throw new NotImplementedError("The fn postprocess needs to be implemented");
  }

  // Standard functions
  async inference(src: string) {
    this.error = false;
    let processedOutput: anyAnnoationObject[];

    if (this.session === undefined) {
      throw new ModelStillLoadingError(
        `Model ${this.modelSrc} is still loading`
      );
    }

    try {
      const inputImage = await this.loadImageToJimp(src);
      const preprocessedImage = this.preprocess(inputImage.clone());
      const inputTensor = this.imageToTensor(preprocessedImage);
      const feeds: Record<string, TypedTensor<"float32">> = {};

      feeds[this.session.inputNames[0]] = inputTensor;

      console.log(`Loaded this feeds:`);
      console.log(feeds);

      const outputData = await this.session.run(feeds);
      const output: any = outputData[this.session.outputNames[0]];
      processedOutput = this.postprocess(output, inputImage);

      console.log("Inference result");
      console.log(processedOutput);
    } catch (e) {
      console.log(e);
      this.error = true;
    }
    return new Promise<anyAnnoationObject[]>((resolve, reject) => {
      this.error ? reject([]) : resolve(processedOutput);
    });
  }

  // Util for class
  async loadModel() {
    let modelResponse = await fetch(this.modelSrc);
    this.modelFile = await modelResponse.arrayBuffer();
    console.log("Loading model file:");
    console.log(this.modelFile);
    this.session = await InferenceSession.create(this.modelFile, {
      executionProviders: this.executionProvider,
      graphOptimizationLevel: "all",
    });
  }

  async loadImageToJimp(src: string) {
    var imageData = await Jimp.default.read(src).then((imageBuffer: Jimp) => {
      return imageBuffer;
    });
    return imageData;
  }

  imageToTensor(imageData: Jimp) {
    const [redArray, greenArray, blueArray] = jimpToImageArrays(imageData);

    const float32Data = arraysToFloat32Data(
      redArray,
      greenArray,
      blueArray,
      this.dims
    );

    const inputTensor: TypedTensor<"float32"> = new Tensor(
      "float32",
      float32Data,
      this.dims
    );

    return inputTensor;
  }
}
