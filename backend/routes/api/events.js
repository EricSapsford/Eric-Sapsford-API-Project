//================================ IMPORTS =================================
const express = require("express");
const { Attendance, Event, EventImage, Groupe, GroupImage, Membership, User, Venue, sequelize } = require("../../db/models")
const { Op } = require("sequelize");

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');


const router = express.Router();

//=============================== END POINTS ===============================


//============================== GET REQUESTS ==============================

//----------------------------- GET ALL EVENTS -----------------------------
//----------------------------- GET ALL EVENTS -----------------------------
//----------------------------- GET ALL EVENTS -----------------------------
//----------------------------- GET ALL EVENTS -----------------------------

// router.get("/", async (req, res) => {

//   let events = await Event.findAll({
//     raw: true,
//     include: [{
//       model: Attendance
//     }],
//     attributes: {
//       include: [
//         [sequelize.fn("COUNT", sequelize.col("Attendances.id")), "numAttending"]
//       ]
//     },
//     group: ["Venue.id"]
//   })

//   for (let index = 0; index < events.length; index++) {

//   }

// })



module.exports = router;
