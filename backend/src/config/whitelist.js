const whitelist = [
  `http://${process.env.API_CLIENT}`,
  `https://${process.env.API_CLIENT}`,
  "http://localhost",
];

export default whitelist;
