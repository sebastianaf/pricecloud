const paths = {
  api: {
    auth: `auth`,
    user: {
      root: `user`,
      verifyEmail: `user/verify-email`,
      passwordReset: `user/password-reset`,
      recovery: `user/recovery`
    }
  },
  web: {
    login: `/login`,
    signup: `/signup`,
    dashboard: `/dashboard`,
    recovery: `/recovery`
  }
};

export default paths;
