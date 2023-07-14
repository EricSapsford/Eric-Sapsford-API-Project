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
      Groupe.belongsTo(models.User, {
        foreignKey: "organizerId"
      });
      Groupe.hasMany(models.Venue, {
        foreignKey: "groupId"
      });
      Groupe.hasMany(models.Membership, {
        foreignKey: "groupId"
      });
      Groupe.hasMany(models.Event, {
        foreignKey: "groupId"
      });
      Groupe.hasMany(models.GroupImage, {
        foreignKey: "groupId"
      });
      Groupe.belongsToMany(models.User, {
        through: "Memberships",
        foreignKey: "groupId",
        otherKey: "userId"
      });
      Groupe.belongsToMany(models.Venue, {
        through: "Events",
        foreignKey: "groupId",
        otherKey: "venueId"
      });
    }
  };

  Groupe.init({
    organizerId: DataTypes.INTEGER,
    name: DataTypes.STRING,
    about: DataTypes.STRING,
    type: {
      type: DataTypes.ENUM("Online", "In person"),
      allowNull: false
    },
    private: DataTypes.BOOLEAN,
    city: DataTypes.STRING,
    state: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Groupe',
  });
  return Groupe;
};
