'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Membership extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Membership.belongsTo(models.User, {
        foreignKey: "userId"
      });
      Membership.belongsTo(models.Groupe, {
        foreignKey: "groupId"
      });
    }
  }
  Membership.init({
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM("host", "co-host", "member", "pending"),
      defaultValue: "pending",
      allowNull: false,
    },
  }, {
    sequelize,
    modelName: 'Membership',
  });
  return Membership;
};
