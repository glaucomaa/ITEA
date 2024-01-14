import { useContext } from "react";
import { ModalContext } from "../hoc/ModalProvider";

export function useModal() {
  return useContext(ModalContext);
}
