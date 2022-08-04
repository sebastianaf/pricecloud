import { Model, DataTypes, Sequelize } from "sequelize";

const CCSP_TABLE = "ccsps";

const CCSPSchema = {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },

  webPage: {
    type: DataTypes.STRING,
    field: "id_user",
    allowNull: false,
    unique: true,
  },

  createAt: {
    allowNull: true,
    field: "created_at",
    type: DataTypes.DATE,
    defaultValue: Sequelize.NOW,
  },
};

class CCSP extends Model {
  static associate() {}

  static config(sequelize) {
    return {
      sequelize,
      tableName: CCSP_TABLE,
      modelName: "CCSP",
      timestamps: false,
    };
  }
}

export { CCSP_TABLE, CCSPSchema, CCSP };
