import boom from "@hapi/boom";
require("dotenv").config();

const authHandler = (req, res, next) => {
  try {
    let token = req.headers.authorization;
    if (token === process.env.API_TOKEN) {
      next();
    } else {
      res.send(boom.unauthorized())
      next(boom.unauthorized());
    }
  } catch (error) {
    res.send(boom.badRequest())
    next(boom.badRequest());
  }
};

export default authHandler;
