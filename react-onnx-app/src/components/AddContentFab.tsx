// MUI
import Fab from "@mui/material/Fab";
import CameraIcon from "@mui/icons-material/Camera";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";

// Other
import { useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ImageCard from "./ImageCard";
import { useAppDispatch } from "../app/hooks";
import { addImage } from "../app/imageState";
import { imageCardObject } from "../util/types";

export default function AddContentFab() {
  // States, Refs & vars
  const [takenImage, setTakenImage] = useState<null | string>(null);
  const [imageName, setImageName] = useState<null | string>(null);
  const [dateCreated, setDateCreated] = useState<null | string>(null);
  const inputFileRef = useRef<null | HTMLInputElement>(null);
  const dispatch = useAppDispatch();

  // Click functions
  const handleModalClose = () => {
    setImageName(null);
    setTakenImage(null);
  };

  const resizeImageToMaximum2Mb = (img: string) => {
    if (img.length > 1_000_000) {
      const rescaleRatio = 1_000_000 / img.length;
      console.log(`Rescale ratio: ${rescaleRatio}`);
      const tmp_img = new Image();
      tmp_img.onload = () => {
        const rescaledSize = [
          Math.floor(tmp_img.width * rescaleRatio),
          Math.floor(tmp_img.height * rescaleRatio),
        ];

        const canvas = document.createElement("canvas");
        canvas.width = rescaledSize[0];
        canvas.height = rescaledSize[1];
        const ctx = canvas.getContext("2d");
        ctx?.drawImage(tmp_img, 0, 0, rescaledSize[0], rescaledSize[1]);

        setTakenImage(canvas.toDataURL("image/jpeg", 1));
      };
      tmp_img.src = img;
    } else {
      setTakenImage(img);
    }
  };

  const saveImage = () => {
    const payload: imageCardObject = {
      id: uuidv4(),
      src: String(takenImage),
      title: String(imageName),
      dateCreated: String(dateCreated),
      highlighted: false,
      annotations: [],
    };
    dispatch(addImage(payload));
    handleModalClose();
  };

  return (
    <>
      <Fab
        sx={{ position: "fixed", bottom: 16, right: 16 }}
        onClick={() => {
          if (inputFileRef.current !== null) {
            inputFileRef.current.click();
          }
        }}
      >
        <CameraIcon />
      </Fab>
      <Modal open={takenImage !== null} onClose={handleModalClose}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <ImageCard
              id={uuidv4()}
              src={takenImage !== null ? takenImage : ""}
              annotations={[]}
              width={window.innerWidth * 0.8}
              height={window.innerHeight * 0.8}
              title={imageName ? imageName : "Your new image"}
              dateCreated={String(dateCreated)}
              highlighted={false}
              showActions={false}
            />
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              padding: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button variant="contained" size="large" onClick={handleModalClose}>
              Discard
            </Button>
          </Grid>
          <Grid
            item
            xs={6}
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Button variant="contained" size="large" onClick={saveImage}>
              Save
            </Button>
          </Grid>
        </Grid>
      </Modal>
      <input
        ref={inputFileRef}
        type="file"
        style={{ display: "none" }}
        accept="image/*"
        onChange={(inp) => {
          if (inp.currentTarget.files !== null) {
            const reader = new FileReader();
            reader.onload = (e) => {
              resizeImageToMaximum2Mb(String(e.target?.result));
            };
            setImageName(inp?.currentTarget.files[0].name);
            setDateCreated(String(new Date()));
            reader.readAsDataURL(inp.currentTarget.files[0]);
          }
        }}
      />
    </>
  );
}
