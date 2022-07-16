import { Sequelize } from "sequelize";
import { dbOptions } from "../config/db";
import { setupModels } from "./models/index";

const { database, host, password, port, user } = dbOptions;

const sequelize = new Sequelize(database, user, password, {
  dialect: "postgres",
  logging: false,
  host,
});

setupModels(sequelize);

sequelize.sync();

export default sequelize;
