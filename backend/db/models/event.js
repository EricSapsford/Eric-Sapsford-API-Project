'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Event.hasMany(models.EventImage, {
        foreignKey: "eventId"
      });
      Event.belongsToMany(models.User, {
        through: models.Attendance,
        foreignKey: "eventId",
        otherKey: "userId"
      });
      Event.hasMany(models.Attendance, {
        foreignKey: "eventId"
      });
      Event.belongsTo(models.Venue, {
        foreignKey: "venueId"
      });
      Event.belongsTo(models.Groupe, {
        foreignKey: "groupId"
      });
    }
  }
  Event.init({
    id: { // If this isn't here Sequelize just doesn't give us an id
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    venueId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    groupId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    type: {
      type: DataTypes.ENUM("Online", "In person"),
      allowNull: false
    },
    //========================
    private: DataTypes.BOOLEAN,
    //========================
    capacity: DataTypes.INTEGER,
    price: DataTypes.DECIMAL,
    startDate: DataTypes.DATE,
    endDate: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Event',
  });
  return Event;
};
