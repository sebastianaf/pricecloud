const paths = {
  api: {
    auth: {
      root: `/auth`,
      login: `/auth/login`,
      changePassword: `/auth/change-password`,
      verifyEmail: `/auth/verify-email`,
      passwordReset: `/auth/password-reset`,
      recovery: `/auth/recovery`
    },
    user: {
      root: `/user`,
      profile: `/user/profile`,
      settings: `/user/settings`,
      credentials: `/user/credentials`
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
