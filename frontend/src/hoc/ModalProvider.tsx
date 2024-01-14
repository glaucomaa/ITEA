import { createContext, ReactNode, useState } from "react";

interface ModalContextInterface {
  openModal: () => void;
  closeModal: () => void;
  modalOpened: boolean;
}

export const ModalContext = createContext<ModalContextInterface>({
  modalOpened: false,
  openModal: () => {},
  closeModal: () => {},
});
export const ModalProvider = ({ children }: any) => {
  const [modalOpened, setModalOpened] = useState(false);

  const openModal = () => {
    setModalOpened(true);
  };
  const closeModal = () => {
    setModalOpened(false);
  };
  const value = { modalOpened, openModal, closeModal };
  return (
    <ModalContext.Provider value={value}>{children}</ModalContext.Provider>
  );
};
