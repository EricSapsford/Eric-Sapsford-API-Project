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
        name: "Thanksgiving Dinner at George's house.",
        description: "This is it folks, the event of the season. No one knows why he now holds his Thanksgiving in January, but if there's one thing we DO know it's that George and his family always love how we show up unanounced every year and just invite ourselves to one of the best spreads this side of the Illinois.",
        type: "In person",
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
        name: "Julliet and Rachel's Wedding",
        description: "Security's gon be tough on this one all, but our numbers have swelled and I'm confident we'll be able to overwelm them long enough to raid the catering tent. Food's set to hit the table at exactly 4:00 PM. If you're not outside the venue in your boxing gloves and running shoes by 3:55 you don't get a cut of the cake.",
        type: "In person",
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
        name: "Oreos under the 18",
        description: "Found a whole palet of cookies being thrown out behind a Wal-mart. I got most of them before they were carted off to the dump, so if you wanna enter a sugar coma with me meet me under the 18 before supplies are gone.",
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
