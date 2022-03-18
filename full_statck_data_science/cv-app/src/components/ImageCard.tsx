// MUI
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import StarIcon from "@mui/icons-material/Star";
import Chip from "@mui/material/Chip";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import HexagonOutlinedIcon from "@mui/icons-material/HexagonOutlined";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import AutoAwesome from "@mui/icons-material/AutoAwesome";

// Own
import {
  bboxAnnotationObject,
  classAnnotationObject,
  imageCardObject,
  polygonAnnotationObject,
} from "../util/types";
import { drawAnnotations } from "../util/drawAnnotations";
import { theme } from "../App";
import { useAppDispatch } from "../app/hooks";
import { updateImage, removeImage } from "../app/imageState";

// React
import { useEffect, useRef, useState } from "react";

export interface imageCardProps extends imageCardObject {
  width: number;
  height: number;
  onClick?: () => void;
}

export default function ImageCard({
  id,
  src,
  title,
  dateCreated,
  highlighted,
  annotations,
  width,
  height,
  onClick,
}: imageCardProps) {
  // States and refs
  const dispatch = useAppDispatch();
  const [resizeSize, setResizeSize] = useState([0, 0]);
  const [showLabel, setShowLabel] = useState<string[]>(
    annotations?.map((el) => {
      return el.id;
    })
  );
  const [highlightedLabel, setHighlightedLabel] = useState<string | null>(null);

  const annotationCanvasRef = useRef<HTMLCanvasElement>(
    document.createElement("canvas")
  );
  const imageRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));

  // Internal functions
  const renderAnnotationChips = (
    annotations: Array<
      bboxAnnotationObject | polygonAnnotationObject | classAnnotationObject
    >
  ) => {
    return annotations?.map(
      (
        el:
          | bboxAnnotationObject
          | polygonAnnotationObject
          | classAnnotationObject
      ) => {
        return (
          <Chip
            label={el.className}
            key={el.id}
            icon={
              el.type === "bbox" ? (
                <CheckBoxOutlineBlankIcon />
              ) : el.type === "polygon" ? (
                <HexagonOutlinedIcon />
              ) : (
                <ImageOutlinedIcon />
              )
            }
            sx={{
              marginLeft: "5px",
              marginRight: "5px",
              backgroundColor: showLabel.includes(el.id) ? el.color : null,
            }}
            variant={showLabel.includes(el.id) ? "filled" : "outlined"}
            // Functions
            onClick={() => {
              if (showLabel?.includes(el.id)) {
                setShowLabel(showLabel.filter((id) => el.id !== id));
              } else {
                setShowLabel([...showLabel, el.id]);
              }
            }}
            onMouseOver={() => {
              setHighlightedLabel(el.id);
            }}
            onMouseOut={() => {
              setHighlightedLabel(null);
            }}
          />
        );
      }
    );
  };

  // Effects
  useEffect(() => {
    const img = new Image();
    img.onload = (el: any) => {
      // Not optimal, however the solution does not work: https://www.kindacode.com/article/react-typescript-image-onload-onerror-events/
      let newResizeSize;

      newResizeSize = [
        el?.currentTarget?.width * ((height * 0.6) / el?.currentTarget?.height),
        height * 0.6,
      ];
      if (newResizeSize[0] > width) {
        newResizeSize = [
          width,
          el?.currentTarget?.height * (width / el?.currentTarget?.width),
        ];
      }

      setResizeSize(newResizeSize);
      // Draw on image canvas
      imageRef?.current
        .getContext("2d")
        ?.drawImage(img, 0, 0, newResizeSize[0], newResizeSize[1]);
    };
    img.src = src;
  }, [height, width, src]);

  useEffect(() => {
    if (resizeSize[0] !== 0 && annotationCanvasRef !== null) {
      drawAnnotations(
        annotations,
        annotationCanvasRef,
        resizeSize[0],
        resizeSize[1],
        highlightedLabel,
        showLabel
      );
    }
  }, [annotations, resizeSize, showLabel, highlightedLabel]);

  return (
    <Card sx={{ margin: "auto", marginTop: 3 }}>
      <CardHeader
        sx={{ background: theme.palette.secondary.main }}
        action={
          <IconButton
            aria-label="settings"
            onClick={() => {
              console.log(`${id} is deleted`);
              dispatch(removeImage({ id: id }));
            }}
          >
            <DeleteIcon />
          </IconButton>
        }
        title={title}
        subheader={new Date(dateCreated).toDateString()}
      />
      <CardMedia>
        <div
          style={{
            width: resizeSize[0],
            height: resizeSize[1],
            position: "relative",
            marginRight: "auto",
            marginLeft: "auto",
            cursor: "pointer",
          }}
          onClick={onClick}
        >
          <canvas
            ref={imageRef}
            width={resizeSize[0]}
            height={resizeSize[1]}
            style={{ position: "absolute" }}
          />
          <canvas
            ref={annotationCanvasRef}
            style={{ position: "absolute" }}
            width={resizeSize[0]}
            height={resizeSize[1]}
          />
        </div>
      </CardMedia>
      <CardContent
        sx={{
          background: theme.palette.background.paper,
          flexWrap: "wrap",
          overflow: "auto",
        }}
      >
        {renderAnnotationChips(annotations)}
      </CardContent>
      <CardActions
        disableSpacing
        sx={{
          position: "relative",
          background: theme.palette.secondary.main,
        }}
      >
        <IconButton
          aria-label="add to favorites"
          sx={{ marginRight: "auto" }}
          onClick={() => {
            dispatch(
              updateImage({
                id: id,
                src: src,
                title: title,
                dateCreated: dateCreated,
                highlighted: !highlighted,
                annotations: annotations,
              })
            );
          }}
        >
          {highlighted ? <StarIcon /> : <StarBorderIcon />}
        </IconButton>

        <IconButton aria-label="execute-inference" sx={{ marginLeft: "auto" }}>
          <AutoAwesome />
        </IconButton>
      </CardActions>
    </Card>
  );
}
