import React, { createContext, useContext, useEffect, useState } from 'react';
import Modal from '../components/Modal';
import { NotificationType } from '../types/notification.type';

interface ModalData {
  title?: string;
  buttonText?: string;
  message?: string;
  notificationType?: NotificationType;
}

const defaultModalData: ModalData = {
  title: `Notificación`,
  buttonText: `Cerrar`,
  message: `Al parecer esta notificación no tiene contenido`,
  notificationType: `info`
};

interface ModalContextProps {
  isModalOpen?: boolean;
  openModal?: () => void;
  closeModal?: () => void;
  modalData?: ModalData;
  setModalData?: (modalData: ModalData) => void;
}

const ModalContext = createContext<ModalContextProps | undefined>(undefined);

export let ModalContextReference: ModalContextProps = {};

export const ModalProvider: React.FC = ({ children }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState<ModalData>(defaultModalData);

  useEffect(() => {
    ModalContextReference.modalData = modalData;
    ModalContextReference.setModalData = setModalData;
    ModalContextReference.isModalOpen = isModalOpen;
    ModalContextReference.openModal = openModal;
    ModalContextReference.closeModal = closeModal;
  }, [modalData]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <ModalContext.Provider
      value={{
        isModalOpen,
        openModal,
        closeModal,
        modalData,
        setModalData
      }}
    >
      {isModalOpen && <Modal />}
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};
