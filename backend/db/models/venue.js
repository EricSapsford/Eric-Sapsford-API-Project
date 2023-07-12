'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Venue.belongsToMany(models.Groupe, {
        through: models.Event,
        foreignKey: "venueId",
        otherKey: "groupId"
      })
      Venue.hasMany(models.Event, {
        foreignKey: "venueId"
      })
      Venue.belongsTo(models.Groupe, {
        foreignKey: "groupId"
      })
    }
  }
  Venue.init({
    groupId: DataTypes.INTEGER,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    lat: DataTypes.INTEGER,
    lng: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Venue',
  });
  return Venue;
};
