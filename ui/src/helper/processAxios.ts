import { AxiosResponse, HttpStatusCode } from 'axios';
import { ModalContextReference } from '../contexts/ModalContext';
import { NotificationType } from '../types/notification.type';
import { SnackbarContextReference } from '../contexts/SnackbarContext';

const processSuccess = (response: AxiosResponse) => {
  if (response.status === 200 || response.status === 201) {
    const data = response.data;
    showNotification(data, 'success');
  }
};

const processError = (error: any) => {
  if (error?.code === `ECONNABORTED`)
    showNotification(
      {
        message: `Solicitud no procesada, por favor intente de nuevo (APE-001)`
      },
      'info'
    );

  const status = error?.response?.response?.data?.statusCode;
  const data = error?.response?.response?.data;

  switch (status) {
    case HttpStatusCode.BadRequest:
      showNotification(data, 'warning');
      break;
    case HttpStatusCode.InternalServerError:
      showNotification(data, 'error');
      break;
    case HttpStatusCode.Unauthorized:
      showNotification(data, 'warning');
      break;
    case HttpStatusCode.Forbidden:
      showNotification(data, 'warning');
      break;
    case HttpStatusCode.NotFound:
      showNotification(data, 'warning');
      break;
    case HttpStatusCode.Conflict:
      showNotification(data, 'warning');
      break;
    case HttpStatusCode.Gone:
      showNotification(data, 'info');
      break;
  }
};

const showNotification = (
  data: { title?: string; message?: string },
  notificationType: NotificationType
) => {
  try {
    if (data?.message) {
      if (data?.title) {
        ModalContextReference.setModalData({
          ...ModalContextReference.modalData,
          title: data.title,
          message: data.message,
          notificationType
        });
        ModalContextReference.openModal();
      } else {
        SnackbarContextReference.showSnackbar(data.message, notificationType);
      }
    }
  } catch (error) {}
};

export { processError, processSuccess };
