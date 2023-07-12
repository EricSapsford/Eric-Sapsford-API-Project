'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Groupe extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Groupe.belongsToMany(models.Venue, {
        through: models.Event,
        foreignKey: "groupId",
        otherKey: "venueId"
      })
      Groupe.belongsToMany(models.User, {
        through: models.Membership,
        foreignKey: "groupId",
        otherKey: "userId"
      })
      Groupe.hasMany(models.User, {
        foreignKey: "organizerId"
      })
      Groupe.belongsTo(models.Venue, {
        foreignKey: "groupId"
      })
      Groupe.belongsTo(models.Membership, {
        foreignKey: "groupId"
      })
      Groupe.belongsTo(models.GroupImage, {
        foreignKey: "groupId"
      })
    }
  }
  Groupe.init({
    oranizerId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    about: DataTypes.STRING,
    type: DataTypes.ENUM,
    private: DataTypes.BOOLEAN,
    city: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Groupe',
  });
  return Groupe;
};
