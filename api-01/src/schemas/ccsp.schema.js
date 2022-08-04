import Joi from "joi";

const name = Joi.string().min(2);
const service = Joi.string().min(2);

const evaluateCCSPSchema = Joi.object({
  nameCCSP_1: name.required(),
  nameCCSP_2: name.required(),
  service: service.required(),
});

export { evaluateCCSPSchema };
