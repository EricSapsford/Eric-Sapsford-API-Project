'use strict';

/** @type {import('sequelize-cli').Migration} */

const { Event } = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "Events";
    await Event.bulkCreate([
      {
        venueId: 1,
        groupId: 1,
        name: "Event1",
        description: "Description of Event1",
        type: "Online",
        //==============
        private: false,
        //==============
        capacity: 30,
        price: 10.00,
        startDate: "2022-01-17",
        endDate: "2022-01-17",
      },
      {
        venueId: 2,
        groupId: 2,
        name: "Event2",
        description: "Description of Event2",
        type: "Online",
        //==============
        private: true,
        //==============
        capacity: 40,
        price: 20.00,
        startDate: "2022-01-18",
        endDate: "2022-01-18",
      },
      {
        venueId: 3,
        groupId: 3,
        name: "Event3",
        description: "Description of Event3",
        type: "In person",
        //==============
        private: false,
        //==============
        capacity: 150,
        price: 30.00,
        startDate: "2022-01-19",
        endDate: "2022-01-19",
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "Events";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      name: { [Op.in]: ["Event1", "Event2", "Event3"] }
    }, {});
  }
};
