import { Model, DataTypes, Sequelize } from "sequelize";
import S from "string";

const tableName = "user";

const UserSchema = {
  id: {
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
    type: DataTypes.INTEGER,
  },
  name: {
    allowNull: false,
    type: DataTypes.STRING,
  },
  createAt: {
    allowNull: false,
    field: "created_at",
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
};

class User extends Model {
  static associate() {}

  static config(sequelize) {
    return {
      sequelize,
      tableName,
      modelName: S(tableName).capitalize().camelize().s,
    };
  }
}

export { tableName, UserSchema, User };
