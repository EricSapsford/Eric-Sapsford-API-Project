'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Attendance } = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Attendances";
    await Attendance.bulkCreate([
      {
        eventId: 1,
        userId: 1,
        status: "attending",
      },
      {
        eventId: 2,
        userId: 2,
        status: "pending",
      },
      {
        eventId: 3,
        userId: 3,
        status: "waitlist",
      },
      {
        eventId: 1,
        userId: 4,
        status: "attending",
      },
      {
        eventId: 1,
        userId: 5,
        status: "pending"
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Attendances";
    const Op = Sequelize.Op;
    await queryInterface.bulkDelete(options, {
      id: { [Op.in]: [1, 2, 3] }
    }, {});
  }
};
