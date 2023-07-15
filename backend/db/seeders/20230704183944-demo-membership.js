'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Membership } = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Memberships";
    await Membership.bulkCreate([
      {
        userId: 1,
        groupId: 1,
        status: "host",
      },
      {
        userId: 2,
        groupId: 2,
        status: "host",
      },
      {
        userId: 3,
        groupId: 3,
        status: "host",
      },
      {
        userId: 4,
        groupId: 1,
        status: "co-host"
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Memberships";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
