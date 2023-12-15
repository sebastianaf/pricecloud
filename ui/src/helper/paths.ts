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
      credentials: `/user/credentials`,
      management: `/user/management`
    },
    compute: {
      location: `/compute/location`,
      node: `/compute/node`,
      image: `/compute/image`
    },
    storage: {
      root: `/storage`
    },
    price: {
      root: `/price`,
      countVendorProducts: `/price/count-vendor-products`,
      productFamilies: `/price/product-families`,
      resumeRegionsByVendor: `/price/resume-regions-by-vendor`,
      countRegions: `/price/count-regions`
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
    profile: `/profile`,
    management: {
      root: `/management`,
      users: `/management/users`,
      console: `/management/console`
    }
  }
};

export default paths;
