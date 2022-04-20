export interface baseAnnotationObject {
  className: string;
  color: string;
  id: string;
  score: number;
  model: string;
}

export interface classAnnotationObject extends baseAnnotationObject {
  type: "class";
}

export interface bboxAnnotationObject extends baseAnnotationObject {
  box: Array<number>;
  type: "bbox";
}

export interface polygonAnnotationObject extends baseAnnotationObject {
  polygon: Array<Array<number>>; // Array, that consists of Arrays with x, y points
  type: "polygon";
}

export type anyAnnoationObject =
  | bboxAnnotationObject
  | polygonAnnotationObject
  | bboxAnnotationObject;

export interface imageCardObject {
  id: string;
  src: string;
  title: string;
  dateCreated: string;
  highlighted: boolean;
  annotations: anyAnnoationObject[];
}
