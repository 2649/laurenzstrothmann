import Modal from "@mui/material/Modal";
import Container from "@mui/material/Container";
import ImageCard, { imageCardProps } from "./ImageCard";
import { useAppSelector } from "../app/hooks";
import { imageCardObject } from "../util/types";
import { useState } from "react";

export default function CustomImageList() {
  const [modalCardId, setModalCardId] = useState<null | string>(null);
  const images = useAppSelector((state) => state.images.images);

  return (
    <>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          justifyItems: "center",
          alignContent: "center",
        }}
      >
        {images.map((image: imageCardObject) => {
          const props: imageCardProps = {
            ...image,
            width: window.innerWidth * 0.49,
            height: window.innerHeight * 0.49,
            onClick: () => {
              setModalCardId(image.id);
            },
          };
          return (
            <ImageCard {...props} key={`${props.id}-image-card-in-list`} />
          );
        })}
      </div>
      <Modal open={modalCardId !== null} onClose={() => setModalCardId(null)}>
        <Container>
          {modalCardId !== null &&
            images
              .filter((el: imageCardObject) => el.id === modalCardId)
              .map((el: imageCardObject) => {
                return (
                  <ImageCard
                    {...{
                      ...el,
                      width: window.innerWidth * 0.8,
                      height: window.innerHeight * 0.8,
                    }}
                    key={`${el.id}-modal-card`}
                  />
                );
              })}
        </Container>
      </Modal>
    </>
  );
}
