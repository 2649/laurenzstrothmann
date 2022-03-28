//MUI
import Button from "@mui/material/Button";
import LinearProgress from "@mui/material/LinearProgress";
import Box from "@mui/material/Box";
import { useState } from "react";

//Own
import { tinyYoloV2Executor } from "../models/tinyYoloV2";
import { theme } from "../App";
import { anyAnnoationObject } from "../util/types";

interface InferenceMenuProps {
  src: string;
  updateAnnotation: (annotations: anyAnnoationObject[]) => void;
}

export default function InferenceMenu({
  src,
  updateAnnotation,
}: InferenceMenuProps) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const inference = () => {
    console.log("Start inference");
    setLoading(true);
    tinyYoloV2Executor
      .inference(src)
      .then((result) => {
        updateAnnotation(result);
        setLoading(false);
        setSuccess(true);
      })
      .catch((e) => {
        setLoading(false);
        setSuccess(false);
      });
  };

  return (
    <Box>
      <Button
        sx={{
          background: success
            ? theme.palette.success.dark
            : theme.palette.primary.main,
        }}
        variant="contained"
        disabled={loading}
        onClick={inference}
      >
        Inference
      </Button>

      {loading && <LinearProgress />}
    </Box>
  );
}
