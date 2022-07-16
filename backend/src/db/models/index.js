import { User, UserSchema } from "./user.model";

const setupModels = (sequelize) => {
  User.init(UserSchema, User.config(sequelize));
};

export { setupModels };
