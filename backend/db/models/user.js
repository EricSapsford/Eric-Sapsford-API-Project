'use strict';
const { Model, Validator } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      // define association here
      User.hasMany(models.Groupe, {
        foreignKey: "organizerId"
      });
      User.belongsToMany(models.Groupe, {
        through: models.Membership,
        foreignKey: "userId",
        otherKey: "groupId"
      });
      // User.belongsToMany(models.Event, {
      //   through: models.Attendance,
      //   foreignKey: "userId",
      //   otherKey: "eventId"
      // });
      User.hasMany(models.Membership, {
        foreignKey: "userId"
      });
      // User.belongsTo(models.Groupe, {
      //   foreignKey: "organizerId"
      // });
      User.hasMany(models.Attendance, {
        foreignKey: "userId"
      });
    }
  };

  User.init(
    {
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 64]
        }
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [2, 64]
        }
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [4, 30],
          isNotEmail(value) {
            if (Validator.isEmail(value)) {
              throw new Error("Cannot be an email.");
            }
          }
        }
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          len: [3, 256],
          isEmail: true
        }
      },
      hashedPassword: {
        type: DataTypes.STRING.BINARY,
        allowNull: false,
        validate: {
          len: [60, 60]
        }
      }
    },
    {
      sequelize,
      modelName: "User",
      defaultScope: {
        attributes: {
          exclude: ["hashedPassword", "email", "createdAt", "updatedAt"]
        }
      }
    }
  );
  return User;
};
