import React, { createContext, useContext, useState } from 'react';

interface ModalContextProps {
  isModalOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  setTitle?: (title: string) => void;
  title?: string;
  setButtonText?: (buttonText: string) => void;
  buttonText: string;
  setBody?: (body: string) => void;
  body: string;
  setModalType?: (modalType: ModalType) => void;
  modalType?: ModalType;
}

export type ModalType = 'success' | 'error' | 'warning' | 'info';

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export const ModalProvider: React.FC = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState(`Notificación`);
  const [buttonText, setButtonText] = useState(`Cerrar`);
  const [body, setBody] = useState(
    `Al parecer esta notificación no tiene contenido`
  );
  const [modalType, setModalType] = useState<ModalType>(`info`);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <ModalContext.Provider
      value={{
        isModalOpen,
        openModal,
        closeModal,
        setTitle,
        title,
        setButtonText,
        buttonText,
        setBody,
        body,
        setModalType,
        modalType
      }}
    >
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('El modal debe estar dentro del proveedor ModalContext');
  }
  return context;
};
