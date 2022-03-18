import { RefObject } from "react";
import {
  bboxAnnotationObject,
  classAnnotationObject,
  polygonAnnotationObject,
} from "./types";

export const drawAnnotations = (
  annotations: Array<
    bboxAnnotationObject | classAnnotationObject | polygonAnnotationObject
  >,
  canvas: RefObject<HTMLCanvasElement>,
  imgW: number,
  imgH: number,
  highlightAnnotationId: string | null,
  filter: string[]
) => {
  // Get context
  const ctx = canvas.current?.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, imgW, imgH);

    annotations.forEach((el) => {
      if (filter.includes(el.id)) {
        ctx.strokeStyle = el.color;
        if (el.type === "bbox") {
          drawBbox(ctx, el, imgW, imgH, highlightAnnotationId);
        }
        if (el.type === "polygon") {
          drawPolygon(ctx, el, imgW, imgH, highlightAnnotationId);
        }
      }
    });
  }
};

const drawBbox = (
  ctx: CanvasRenderingContext2D,
  annotation: bboxAnnotationObject,
  imgW: number,
  imgH: number,
  highlightAnnotationId: string | null
) => {
  ctx.beginPath();
  ctx.rect(
    annotation.box[0] * imgW,
    annotation.box[1] * imgH,
    annotation.box[0] * imgW + annotation.box[2] * imgW,
    annotation.box[1] * imgH + annotation.box[3] * imgH
  );
  if (highlightAnnotationId === annotation.id) {
    ctx.fillStyle = annotation.color + "4D";
    ctx.fill();
  }
  ctx.stroke();
};

const drawPolygon = (
  ctx: CanvasRenderingContext2D,
  annotation: polygonAnnotationObject,
  imgW: number,
  imgH: number,
  highlightAnnotationId: string | null
) => {
  ctx.beginPath();
  ctx.moveTo(annotation.polygon[0][0] * imgW, annotation.polygon[0][1] * imgH);
  annotation.polygon.forEach((el: number[], idx: number) => {
    if (idx === 0) {
      ctx.moveTo(el[0] * imgW, el[1] * imgH);
    } else {
      ctx.lineTo(el[0] * imgW, el[1] * imgH);
    }
  });
  if (highlightAnnotationId === annotation.id) {
    ctx.fillStyle = annotation.color + "4D";
    ctx.fill();
  }
  ctx.closePath();
  ctx.stroke();
};
