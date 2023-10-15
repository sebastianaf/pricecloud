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

const processError = (response: any) => {
  const status = response.response.data.statusCode;
  switch (status) {
    case HttpStatusCode.InternalServerError:
      showNotification(response.response.data, 'error');
      break;
    case HttpStatusCode.Unauthorized:
      showNotification(response.response.data, 'warning');
      break;
    case HttpStatusCode.Forbidden:
      showNotification(response.response.data, 'warning');
      break;
    case HttpStatusCode.NotFound:
      showNotification(response.response.data, 'warning');
      break;
    case HttpStatusCode.Conflict:
      showNotification(response.response.data, 'warning');
      break;
    case HttpStatusCode.Gone:
      showNotification(response.response.data, 'info');
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
