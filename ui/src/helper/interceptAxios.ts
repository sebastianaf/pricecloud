//import { toast, ToastOptions } from 'react-toastify';
//import { ToastConfig } from './toastConfig';
//import Router from 'next/router';
//import Modal from 'components/ui/toast/Toas.jsx';

import { AxiosResponse, HttpStatusCode } from 'axios';
import { ModalContextReference } from '../contexts/ModalContext';

const interceptError = (response: AxiosResponse) => {
  switch (response.status) {
    case HttpStatusCode.InternalServerError:
      break;
    case HttpStatusCode.Unauthorized:
      break;
    case HttpStatusCode.Forbidden:
      break;
    case HttpStatusCode.NotFound:
      break;
    case HttpStatusCode.Conflict:
      break;
    case HttpStatusCode.Gone:
      break;
  }
};
const interceptSuccess = (response: AxiosResponse) => {
  if (response.status === 200 || response.status === 201) {
    ModalContextReference.setModalData({
      ...ModalContextReference.modalData,
      title: `Éxito!`,
      message: `Se ha realizado la operación correctamente`,
      notificationType: 'success'
    });
    ModalContextReference.openModal();
  }
};

export { interceptError, interceptSuccess };
