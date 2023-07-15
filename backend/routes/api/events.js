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

//-------------- GET DETAILS OF AN EVENT SPECIFIED BY ITS ID ---------------
//-------------- GET DETAILS OF AN EVENT SPECIFIED BY ITS ID ---------------
//-------------- GET DETAILS OF AN EVENT SPECIFIED BY ITS ID ---------------
//-------------- GET DETAILS OF AN EVENT SPECIFIED BY ITS ID ---------------

router.get("/:eventId", async (req, res) => {

  const eventId = req.params.eventId

  let events = await Event.findByPk(eventId, {
    include: [
      {
        model: Attendance,
        attributes: [],
      },
      {
        model: Groupe,
        attributes: [
          "id",
          "name",
          "city",
          "state"
        ]
      },
      {
        model: Venue,
        attributes: [
          "id",
          "city",
          "state",
        ]
      },
      {
        model: EventImage,
        attributes: [
          "id",
          "url",
          "preview"
        ],
      },
    ],
    attributes: {
      include: [
        [sequelize.fn("COUNT", sequelize.col("Attendances.eventId")), "numAttending"]
      ],
    },
    group: ["Event.id"]
  })

  if (!events) {
    res.status(404);
    return res.json({
      "message": "Event couldn't be found"
    })
  } else {
    res.status(200)
    return res.json({ Events: events })
  }
})

//----------------------------- GET ALL EVENTS -----------------------------
//----------------------------- GET ALL EVENTS -----------------------------
//----------------------------- GET ALL EVENTS -----------------------------
//----------------------------- GET ALL EVENTS -----------------------------

router.get("/", async (req, res) => {

  let events = await Event.findAll({
    include: [
      {
        model: Attendance,
        attributes: [],
      },
      {
        model: EventImage,
        attributes: [],
      },
      {
        model: Groupe,
        attributes: [
          "id",
          "name",
          "city",
          "state"
        ]
      },
      {
        model: Venue,
        attributes: [
          "id",
          "city",
          "state",
        ]
      }
    ],
    attributes: {
      include: [
        [sequelize.fn("COUNT", sequelize.col("Attendances.eventId")), "numAttending"]
      ],
    },
    group: ["Event.id"]
  })


  /*
  THIS WORKS, BUT IS SUPER INEFFICIENT AND WAS MADE UNECESSARY BY THE FORCED ID
  ASSIGNMENT IN EVENT, ATTENDANCE, AND EVENTIMAGE MODELS INIT FUNCTIONS
  */
  // let attendance = await Attendance.findAll()
  // console.log(attendance);
  // let dog = 0;

  // console.log(events);
  // console.log(attendance)

  // for (let index = 0; index < events.length; index++) {
  //   for (let i = 0; i < attendance.length; i++) {
  //     if (attendance[i].dataValues.eventId === events[index].id) dog++;
  //   }
  // }

  // console.log("dog", dog);
  // console.log(att)

  for (let index = 0; index < events.length; index++) {
    let image = await Event.findByPk(events[index].id, {
      raw: true,
      include: [{
        model: EventImage,
        where: {
          preview: true
        },
        attributes: ["url"]
      }]
    });

    // console.log("******NEWLINE******", image)

    if (image) {
      events[index].dataValues.previewImage = image["EventImages.url"];
    } else {
      events[index].dataValues.previewImage = "preview does not exist";
    };
  }

  // console.log("=====EVENTS=====", events)

  res.status(200)
  return res.json({ Events: events })

})



module.exports = router;
