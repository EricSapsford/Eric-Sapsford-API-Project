'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Attendance extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Attendance.belongsTo(models.Event, {
        foreignKey: "eventId"
      });
      Attendance.belongsTo(models.User, {
        foreignKey: "userId"
      });
    }
  }
  Attendance.init({
    id: { // If this isn't here Sequelize just doesn't give us an id
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    eventId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    status: {
      type: DataTypes.ENUM("attending", "waitlist", "pending"),
      defaultValue: "pending"
    },
  }, {
    sequelize,
    modelName: 'Attendance',
  });
  return Attendance;
};
