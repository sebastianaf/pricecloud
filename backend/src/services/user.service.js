import sequelize from "../db/sequelize";
import boom from "@hapi/boom";

const { models } = sequelize;

class UserService {
  constructor() {}

  async find() {
    try {
      const { data, metadata } = await models.User.findAll();
      return { data };
    } catch (error) {
      return boom.badData(error);
    }
  }

  async findOne(id) {
    return { id };
  }
}

export default UserService;
