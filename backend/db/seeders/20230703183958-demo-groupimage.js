'use strict';

/** @type {import('sequelize-cli').Migration} */

const { GroupImage } = require("../models");

let options = {};
if (process.env.NODE_ENV === 'production') {
  options.schema = process.env.SCHEMA;  // define your schema in options object
}

module.exports = {
  async up(queryInterface, Sequelize) {
    options.tableName = "GroupImages";
    await GroupImage.bulkCreate([
      {
        groupId: 1,
        url: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Thanksgiving_Dinner_table.jpg/800px-Thanksgiving_Dinner_table.jpg?20210213175610",
        preview: true,
      },
      {
        groupId: 2,
        url: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
        preview: true,
      },
      {
        groupId: 3,
        url: "https://images.unsplash.com/photo-1567275296612-d63f0e092654?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80",
        preview: true,
      }
    ], { validate: true });
  },

  async down(queryInterface, Sequelize) {
    options.tableName = "GroupImages";
    const Op = Sequelize.Op;
    return queryInterface.bulkDelete(options, {
      url: { [Op.in]: ["https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/Thanksgiving_Dinner_table.jpg/800px-Thanksgiving_Dinner_table.jpg?20210213175610", "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80", "https://images.unsplash.com/photo-1567275296612-d63f0e092654?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80"] }
    }, {});
  }
};
