import Joi from "joi";

const id = Joi.number().integer();
const name = Joi.string().min(4);

const createUserSchema = Joi.object({
  name: name.required(),
});

const getUsetSchema = Joi.object({
    id: id.required(),
  });

export { createUserSchema };
