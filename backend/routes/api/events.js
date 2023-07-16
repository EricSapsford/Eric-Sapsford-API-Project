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

  //FINESSE WASN'T WORKING, SO NOW WE BRUTAL
  const event = await Event.findByPk(eventId, {
    include: [
      { model: Attendance },
      { model: Groupe },
      { model: Venue },
      { model: EventImage },
    ]
  }
  );

  if (!event) {
    res.status(404);
    return res.json({
      "message": "Event couldn't be found"
    })
  }

  let numAttending = event.Attendances.length;

  let groupe = event.Groupe;
  let groupeObj = {
    id: groupe.id,
    name: groupe.name,
    private: groupe.private,
    city: groupe.city,
    state: groupe.state
  }

  let venue = event.Venue;
  let venueSwitch;

  if (!venue) {
    venueSwitch = null;
  } else {
    venueSwitch = {
      id: venue.id,
      address: venue.address,
      city: venue.city,
      state: venue.state,
      lat: venue.lat,
      lng: venue.lng
    }
  };

  let eventImages = await EventImage.findAll({
    attributes: [
      "id",
      "url",
      "preview"
    ],
    where: {
      eventId,
    }
  })

  let spoofEventObj = {
    id: event.id,
    groupId: event.groupId,
    venueId: event.venueId,
    name: event.name,
    description: event.description,
    type: event.type,
    capacity: event.capacity,
    price: event.price,
    startDate: event.startDate,
    endDate: event.endDate,
    numAttending: numAttending,
    Group: groupeObj,
    Venue: venueSwitch,
    EventImages: eventImages
  }

  res.status(200);
  return res.json(spoofEventObj);


  // THIS DOESN'T UPDATE THE IMAGE ARRAY
  // ALSO, THE ATTENDANCE FUNCITON FREAKED OUT AND STARTED SHOWING 12
  // GO BRUTAL
  // let events = await Event.findByPk(eventId, {
  //   include: [
  //     {
  //       model: Attendance,
  //       attributes: [],
  //     },
  //     {
  //       model: Groupe,
  //       attributes: [
  //         "id",
  //         "name",
  //         "city",
  //         "state"
  //       ]
  //     },
  //     {
  //       model: Venue,
  //       attributes: [
  //         "id",
  //         "city",
  //         "state",
  //       ]
  //     },
  //     {
  //       model: EventImage,
  //       attributes: [
  //         "id",
  //         "url",
  //         "preview"
  //       ],
  //     },
  //   ],
  //   attributes: {
  //     include: [
  //       [sequelize.fn("COUNT", sequelize.col("Attendances.eventId")), "numAttending"]
  //     ],
  //   },
  //   group: ["Event.id"]
  // })

  // console.log(events.EventImages);

  // if (!events) {
  //   res.status(404);
  //   return res.json({
  //     "message": "Event couldn't be found"
  //   })
  // } else {
  //   res.status(200)
  //   return res.json({ Events: events })
});

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
    attributes: [
      "id",
      "groupId",
      "venueId",
      "name",
      "type",
      "startDate",
      "endDate",
    ]
  })

  for (let i = 0; i < events.length; i++) {
    let attendance = await Attendance.findAll({
      where: {
        eventId: events[i].id
      }
    })

    events[i].dataValues.numAttending = attendance.length
  }

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
  return res.json({ Evetns: events })

})



//__________________________________ validator __________________________________

const validateEvent = [
  check("name")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Name is required"),
  check("type")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Type is required"),
  check("capacity")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Capacity is required"),
  check("price")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Price is required"),
  check("description")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Description is required"),
  check("startDate")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Start date is required"),
  check("endDate")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("End date is required"),
  // THAT DOES IT FOR THE EXISTS CHECKS
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
  check("type")
    .exists({ checkFalsy: true })
    .isIn(["Online", "In person"])
    .withMessage("Type must be Online or In person"),
  check("capacity")
    .exists({ checkFalsy: true })
    .isInt()
    .withMessage("Capacity must be an integer"),
  // check("price")
  //   .exists({ checkFalsy: true })
  //   .isDecimal({ decimal_digits: 2 })
  //   .withMessage("Price is invalid"),
  handleValidationErrors
];

//================================= PUT REQUESTS ================================

//--------------------- EDIT AN EVENT SPECIFIED BY ITS ID -----------------------
//--------------------- EDIT AN EVENT SPECIFIED BY ITS ID -----------------------
//--------------------- EDIT AN EVENT SPECIFIED BY ITS ID -----------------------
//--------------------- EDIT AN EVENT SPECIFIED BY ITS ID -----------------------

router.put("/:eventId", requireAuth, validateEvent, async (req, res) => {

  // log in check
  const { user } = req;
  if (!user) {
    res.status(401);
    return res.json({
      "message": "Authentication Required. Forgot to log in didn't you?"
    })
  }

  const { venueId, name, type, capacity, price, description, startDate, endDate } = req.body

  const userId = user.dataValues.id;
  const eventId = req.params.eventId;


  /*
  *************************************************************************
  CURRENT USER MUST BE THE ORGANIZER OF THE GROUPE OR A MEMBER OF THE GROUP
  WITH A STATUS OF "CO-HOST"
  *************************************************************************
  */

  let event = await Event.findByPk(eventId, {
    include: [
      {
        model: Groupe,
        include: [
          { model: Membership }
        ]
      }
    ]
  });

  if (!event) {
    res.status(404);
    return res.json({
      "message": "Event couldn't be found"
    })
  }

  let memberToken = 0;
  let memberArr = event.dataValues.Groupe.dataValues.Memberships

  for (let i = 0; i < memberArr.length; i++) {
    if (memberArr[i].status === "co-host" && memberArr[i].userId === userId) {
      memberToken++;
    }
    // console.log(memberArr[i].status, memberArr[i].userId)
  }


  if (event.dataValues.Groupe.dataValues.organizerId === userId || memberToken > 0) {

    event.venueId = venueId;
    event.name = name;
    event.type = type;
    event.capacity = capacity;
    event.price = price;
    event.description = description;
    event.startDate = startDate;
    event.endDate = endDate;
    await event.save();

    let findEvent = await Event.findOne({
      attributes: [
        "id",
        "groupId",
        "venueId",
        "name",
        "type",
        "capacity",
        "price",
        "description",
        "startDate",
        "endDate"
      ],
      where: {
        id: eventId,
        venueId,
        name,
        type,
        capacity,
        price,
        description,
        startDate,
        endDate
      }
    })


    /*
    *************************************************************************
    CURRENT USER MUST BE THE ORGANIZER OF THE GROUPE OR A MEMBER OF THE GROUP
    WITH A STATUS OF "CO-HOST"
    *************************************************************************
    */
    res.status(200);
    return res.json(findEvent);
  } else {
    res.status(403);
    return res.json({
      "message": "Whoa there buckeroo, that ain't yours"
    })
  }
});

//================================ POST REQUESTS ================================

//------------- ADD AN IMAGE TO A EVENT BASED ON THE EVENT'S ID ---------------
//------------- ADD AN IMAGE TO A EVENT BASED ON THE EVENT'S ID ---------------
//------------- ADD AN IMAGE TO A EVENT BASED ON THE EVENT'S ID ---------------
//------------- ADD AN IMAGE TO A EVENT BASED ON THE EVENT'S ID ---------------

router.post("/:eventId/images", requireAuth, async (req, res) => {

  // log in check
  const { user } = req;
  if (!user) {
    res.status(401);
    return res.json({
      "message": "Authentication Required. Forgot to log in didn't you?"
    })
  }

  const userId = user.dataValues.id;
  const eventId = req.params.eventId;

  const { url, preview } = req.body;

  let event = await Event.findByPk(eventId, {
    include: [
      {
        model: Groupe,
        include: {
          model: Membership
        }
      },
      { model: Attendance }

    ]
  });

  if (!event) {
    res.status(404);
    return res.json({
      "message": "Event couldn't be found"
    });
  }


  let memberToken = 0;
  let attendeToken = 0;
  let memberArr = event.dataValues.Groupe.dataValues.Memberships
  let attendeArr = event.dataValues.Attendances

  for (let i = 0; i < memberArr.length; i++) {
    if (memberArr[i].status === "co-host" && memberArr[i].userId === userId) {
      memberToken++;
    }
    // console.log(memberArr[i].status, memberArr[i].userId)
  }

  for (let i = 0; i < attendeArr.length; i++) {
    if (attendeArr[i].status === "attending" && attendeArr[i].userId === userId) {
      attendeToken++;
    }
  }

  // console.log(event.dataValues.Groupe.dataValues.Memberships);
  // console.log(event)

  if (event) {
    if (event.dataValues.Groupe.dataValues.organizerId === userId || memberToken > 0 || attendeToken > 0) {
      if (!preview) preview = false;

      await EventImage.bulkCreate([{
        eventId,
        url,
        preview
      },
      ], { validate: true });

      // THIS ONLY WORKS SO LONG AS THE URL AS IS UNIQUE
      const newImage = await EventImage.findOne({
        attributes: [
          "id",
          "url",
          "preview"
        ],
        where: {
          eventId,
          url,
          preview
        }
      });


      res.status(200);
      return res.json(newImage);
    } else {
      res.status(403)
      return res.json({
        "message": "That's not yours",
      });
    }
  }
})

//============================== DELETE REQUESTS ==============================

//-------------------- DELETE AN EVENT SPECIFIED BY ITS ID --------------------
//-------------------- DELETE AN EVENT SPECIFIED BY ITS ID --------------------
//-------------------- DELETE AN EVENT SPECIFIED BY ITS ID --------------------
//-------------------- DELETE AN EVENT SPECIFIED BY ITS ID --------------------

router.delete("/:eventId", requireAuth, async (req, res) => {

  // log in check
  const { user } = req;
  if (!user) {
    res.status(401);
    return res.json({
      "message": "Authentication Required. Forgot to log in didn't you?"
    })
  }

  const userId = user.dataValues.id;
  const eventId = req.params.eventId;

  /*
  *************************************************************************
  CURRENT USER MUST BE THE ORGANIZER OF THE GROUPE OR A MEMBER OF THE GROUP
  WITH A STATUS OF "CO-HOST"
  *************************************************************************
  */

  let event = await Event.findByPk(eventId, {
    include: [
      {
        model: Groupe,
        include: [
          { model: Membership }
        ]
      }
    ]
  });

  if (!event) {
    res.status(404);
    return res.json({
      "message": "Event couldn't be found"
    })
  }

  let memberToken = 0;
  let memberArr = event.dataValues.Groupe.dataValues.Memberships

  for (let i = 0; i < memberArr.length; i++) {
    if (memberArr[i].status === "co-host" && memberArr[i].userId === userId) {
      memberToken++;
    }
    // console.log(memberArr[i].status, memberArr[i].userId)
  }


  if (event.dataValues.Groupe.dataValues.organizerId === userId || memberToken > 0) {
    await event.destroy();
    res.status(200);
    return res.json({
      "message": "Successfully deleted",
    });

    /*
    *************************************************************************
    CURRENT USER MUST BE THE ORGANIZER OF THE GROUPE OR A MEMBER OF THE GROUP
    WITH A STATUS OF "CO-HOST"
    *************************************************************************
    */

  } else {
    res.status(403);
    return res.json({
      "message": "Whoa there buckeroo, that ain't yours"
    })
  }
})






module.exports = router;
