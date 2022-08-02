const errorCodes = {
  INCOMPLETE_USER_OR_PASSWORD: {
    code: 20010,
    title: `Error de autenticación`,
    description: `Los datos de inicio de sesión están incompletos`,
  },
  CONECTION_ERROR: {
    code: 20015,
    title: `Error de conexión`,
    description: `No se ha podido establecer conexión con el servidor, por favor intente en otro momento. Si el problema persiste informe al administrador de la aplicación.`,
  },
};

export default errorCodes;
