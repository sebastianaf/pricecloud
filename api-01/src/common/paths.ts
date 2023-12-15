export const paths = {
  web: {
    login: `/login`,
    verify: `/verify`,
    passwordReset: `/password-reset`,
  },
  api02: {},
  api03: {
    compute: {
      root: `/compute`,
      images: `/compute/images`,
      locations: `/compute/locations`,
      nodes: `/compute/nodes`,
      deploy: `/compute/deploy`,
    },
    storage: {
      root: `/storage`,
      buckets: `/storage/buckets`,
      create: `/storage/create`,
    },
  },
};

export default paths;
