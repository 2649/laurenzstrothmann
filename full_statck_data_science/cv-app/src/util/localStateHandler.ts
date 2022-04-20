import { imageCardObject } from "./types";

const idName = "Ids";

export const saveStateIds = (event: string[]) => {
  localStorage.setItem(idName, JSON.stringify(event));
};

export const loadStateIds = (): string[] => {
  const ids = localStorage.getItem(idName);
  return ids !== null ? JSON.parse(ids) : [];
};

export const saveImageState = (event: imageCardObject) => {
  localStorage.setItem(event.id, JSON.stringify(event));
};

export const loadImageState = (id: string): imageCardObject => {
  return JSON.parse(String(localStorage.getItem(id)));
};

export const removeImageState = (id: string) => {
  localStorage.removeItem(id);
};
