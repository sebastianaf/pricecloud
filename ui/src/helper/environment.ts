export const UI_PORT =
  process.env.ENV === 'prod'
    ? process.env.UI_PORT
    : process.env.NEXT_PUBLIC_UI_PORT;

export const API_HOST =
  process.env.ENV === 'prod'
    ? process.env.API_HOST
    : process.env.NEXT_PUBLIC_API_HOST;
