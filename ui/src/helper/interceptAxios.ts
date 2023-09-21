//import { toast, ToastOptions } from 'react-toastify';
//import { ToastConfig } from './toastConfig';
//import Router from 'next/router';
//import Modal from 'components/ui/toast/Toas.jsx';

import { AxiosResponse } from 'axios';

const interceptAxios = (response: AxiosResponse) => {
  if (response.status === 400) {
  } else {
  }

  /* const { Toaster } = Modal();
  const dicIcon = {
    '400': 'error',
    '401': 'error',
    '404': 'erorr',
    '403': 'error',
    '409': 'warning',
    '410': 'info'
  };
  if (error.code == 'ERR_NETWORK') {
    toast.error(
      'Error de comunicación con el servidor, por favor intenta nuevamente.',
      ToastConfig('ERR_NETWORK') as ToastOptions<{}>
    );
  } else if (error.response.data.modalTitle) {
    return Toaster(
      error.response.data.message,
      error.response.data.modalTitle,
      dicIcon[error.response.status.toString() as keyof typeof dicIcon]
    );
  } else if (error.response.status == 400) {
    toast.error(
      <div className="relative flex flex-col">
        {error.response.data.message.indexOf('(') == -1 ? (
          error.response.data.message
        ) : (
          <>
            {error.response.data.message.substring(
              0,
              error.response.data.message.indexOf('(')
            )}
            <span className="text-xs text-gray-500 text-center">
              {error.response.data.message.substring(
                error.response.data.message.indexOf('('),
                error.response.data.message.length
              )}
            </span>
          </>
        )}
      </div>,
      ToastConfig(error.response.status) as ToastOptions<{}>
    );
  } else if (error.response.status == 401) {
    toast.error(
      'Sesión expirada',
      ToastConfig(error.response.status) as ToastOptions<{}>
    );
    window.localStorage.clear();
    setTimeout(() => {
      Router.reload();
    }, 1000);
  } else if (error.response.status == 403) {
    Router.push('/dashboard/home');
    toast.error(
      error.response.data.message,
      ToastConfig(error.response.status) as ToastOptions<{}>
    );
    return;
  } else if (error.response.status == 404) {
    toast.error(
      error.response.data.message,
      ToastConfig(error.response.status) as ToastOptions<{}>
    );
  }
  // else if (error.response.status == 406) {
  // 	return Toaster(
  // 		error.response.data.message,
  // 		error.response.data.modalTitle,
  // 		''
  // 	)
  // }
  else if (error.response.status == 409) {
    toast.warn(
      <div className="relative flex flex-col">
        {error.response.data.message.indexOf('(') == -1 ? (
          error.response.data.message
        ) : (
          <>
            {error.response.data.message.substring(
              0,
              error.response.data.message.indexOf('(')
            )}
            <span className="text-xs text-gray-500 text-center">
              {error.response.data.message.substring(
                error.response.data.message.indexOf('('),
                error.response.data.message.length
              )}
            </span>
          </>
        )}
      </div>,
      ToastConfig(error.response.status) as ToastOptions<{}>
    );
  } else if (error.response.status == 410) {
    toast.info(
      <div className="relative flex flex-col">
        {error.response.data.message.indexOf('(') == -1 ? (
          error.response.data.message
        ) : (
          <>
            {error.response.data.message.substring(
              0,
              error.response.data.message.indexOf('(')
            )}
            <span className="text-xs text-gray-500 text-center">
              {error.response.data.message.substring(
                error.response.data.message.indexOf('('),
                error.response.data.message.length
              )}
            </span>
          </>
        )}
      </div>,
      ToastConfig(error.response.status) as ToastOptions<{}>
    );
  } else if (error.response.status == 500) {
    toast.error(
      'Ha ocurrido un error inesperado, por favor espera unos minutos e intenta nuevamente.',
      ToastConfig(error.response.status) as ToastOptions<{}>
    );
  }
};

const axiosSuccess = (response: any) => {
  const { Toaster } = Modal();

  if (response.status == 200 || response.status == 201) {
    if (response.data.modalTitle != undefined) {
      return Toaster(response.data.message, response.data.modalTitle);
    }
    if (response.data != undefined && response.data.message != undefined) {
      toast.success(
        <div className="relative flex flex-col">
          {response.data.message.indexOf('(') == -1 ? (
            response.data.message
          ) : (
            <>
              {response.data.message.substring(
                0,
                response.data.message.indexOf('(')
              )}{' '}
              <span className="text-xs text-gray-500">
                {response.data.message.substring(
                  response.data.message.indexOf('('),
                  response.data.message.length
                )}
              </span>
            </>
          )}
        </div>,
        ToastConfig(response.status) as ToastOptions<{}>
      );
    }
  } */
};

export { interceptAxios };
