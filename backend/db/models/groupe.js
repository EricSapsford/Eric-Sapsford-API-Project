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
