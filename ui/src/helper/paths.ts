const paths = {
  api: {
    auth: {
      root: `auth`,
      login: `auth/login`
    },
    user: {
      root: `user`,
      verifyEmail: `user/verify-email`,
      passwordReset: `user/password-reset`,
      recovery: `user/recovery`,
      profile: `user/profile`
    }
  },
  web: {
    login: `/login`,
    signup: `/signup`,
    dashboard: {
      root: `/dashboard`,
      explore: `/dashboard/explore`,
      compare: `/dashboard/compare`
    },
    providers: {
      explore: `/providers/explore`,
      settings: `/providers/settings`
    },
    deploy: {
      aws: `/deploy/aws`
    },
    recovery: `/recovery`,
    profile: `/profile`
  }
};

export default paths;
