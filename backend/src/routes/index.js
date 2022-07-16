import express from "express";

import userRouter from "./user.router";

const routerApi = (app) => {
  const router = express.Router();
  app.use("/api", router);
  router.use("/user", userRouter);
};

export default routerApi;
