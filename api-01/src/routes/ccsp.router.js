import express from "express";

import CCSPService from "../services/ccsp.service";
import { evaluateCCSPSchema } from "../schemas/ccsp.schema";
import validatorHandler from "../middlewares/validator.handler";

const router = express.Router();
const service = new CCSPService();

router.post(
  "/evaluate",
  validatorHandler(evaluateCCSPSchema, `body`),
  async (req, res, next) => {
    try {
      const evaluation = await service.evaluate();
      res.send(evaluation);
    } catch (error) {
      next(error);
    }
  }
);

export default router;
