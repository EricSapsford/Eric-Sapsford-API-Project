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

//------------ GET ALL ATTENDEES OF AN EVENT SPECIFIED BY ITS ID -----------
//------------ GET ALL ATTENDEES OF AN EVENT SPECIFIED BY ITS ID -----------
//------------ GET ALL ATTENDEES OF AN EVENT SPECIFIED BY ITS ID -----------
//------------ GET ALL ATTENDEES OF AN EVENT SPECIFIED BY ITS ID -----------

router.get("/:eventId/attendees", async (req, res) => {

  const { user } = req;
  const userId = user.dataValues.id;
  const eventId = req.params.eventId;

  let attendies = await Attendance.findAll({
    include: [
      {
        model: User,
        include: [
          {
            model: Groupe
          }
        ]
      },
      { model: Event }
    ],
    where: {
      eventId
    }
  })

  if (attendies.length === 0) {
    res.status(404);
    return req.json({
      "message": "Event couldn't be found"
    })
  }

  // let findcoHost = await Attendance.findOne({
  //   includ: [
  //     {
  //       model: User,
  //       include: [
  //         {
  //           model: Membership,
  //           where: {
  //             status: "co-host",
  //             userId
  //           }
  //         }
  //       ]
  //     }
  //   ]
  // })

  // console.log(findcoHost)

  let cohostToken = false;
  // if (findcoHost) cohostToken = true;
  // console.log("CHOHOST", cohostToken);

  for (let j = 0; j < attendies.length; j++) {
    console.log(attendies);
    console.log(attendies[j].User.id)
    for (let index = 0; index < attendies[j].User.dataValues.Groupes.length; index++) {
      if (userId === attendies[j].User.id && attendies[j].User.dataValues.Groupes[index].dataValues.Membership.dataValues.status === "co-host") cohostToken = true;
    }
  }

  // console.log(cohostToken);

  let organToken = false
  // let findOrgan = await Attendance.findOne({
  //   include: [
  //     {
  //       model: User,
  //       include: [
  //         {
  //           model: Groupe,
  //           where: {
  //             organizerId: userId
  //           }
  //         }
  //       ]
  //     }
  //   ]
  // })

  // console.log("ORGAN", organToken);
  // if (findOrgan) organToken = true;

  // JUST TO SHOW THAT I COULD. THIS WAS ACTUALLY REALLY FUN
  for (let k = 0; k < attendies.length; k++) {
    for (let index = 0; index < attendies[k].dataValues.User.dataValues.Groupes.length; index++) {
      if (userId === attendies[k].dataValues.User.dataValues.Groupes[index].dataValues.organizerId) organToken = true;
    }
  }

  if (organToken || cohostToken) {

    let attendiesArr = [];
    for (let i = 0; i < attendies.length; i++) {
      let realId = await Attendance.findOne({
        where: {
          userId: attendies[i].User.id,
          eventId,
        }
      })
      // console.log("****REALID****", realId);
      // console.log("hello")
      let attendiesObj = {
        id: realId.id,
        firstName: attendies[i].User.firstName,
        lastName: attendies[i].User.lastName,
        Attendance: {
          status: attendies[i].status
        }
      }
      attendiesArr.push(attendiesObj);
    }

    res.status(200);
    return res.json({ Attendees: attendiesArr });
  } else {

    let attendiesArr = [];
    for (let i = 0; i < attendies.length; i++) {
      let realId = await Attendance.findOne({
        where: {
          userId: attendies[i].User.id,
          eventId,
        }
      })
      let index = i;
      let currStatus = attendies[i].status
      // console.log(currStatus)
      while (currStatus === "pending") {
        i++;
        if (i >= attendies.length) {
          i--;
          break;
        }
        currStatus = attendies[index + 1].status
      }
      let attendiesObj = {
        id: realId.id,
        firstName: attendies[i].User.firstName,
        lastName: attendies[i].User.lastName,
        Attendance: {
          status: attendies[i].status
        }
      }
      attendiesArr.push(attendiesObj);
      if (attendiesArr[attendiesArr.length - 1].Attendance.status === "pending") {
        attendiesArr.pop()
      }
    }

    res.status(200);
    return res.json({ Attendees: attendiesArr });
  }
})

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

//__________________________________ validator __________________________________

const validatePaginatorAndQueries = [
  check("page")
    .optional()
    .custom(async value => {
      if (value <= 0) {
        throw new Error();
      }
    })
    .withMessage("Page must be greater than or equal to 1"),
  check("size")
    .optional()
    .custom(async value => {
      if (value <= 0) {
        throw new Error();
      }
    })
    .withMessage("Size must be greater than or equal to 1"),
  check("name")
    .optional()
    .exists({ checkFalsy: true })
    .isString()
    .withMessage("Name must be a string"),
  check("name")
    .optional()
    .exists({ checkFalsy: true })
    .isLength({ min: 5 })
    .withMessage("Name must be at least 5 characters"),
  check("type")
    .optional()
    .exists({ checkFalsy: true })
    .isIn(["Online", "In person"])
    .withMessage("Type must be 'Online' or 'In person'"),
  // check("startDate")
  //   .exists({ checkFalsy: false })
  //   .isDate()
  //   .withMessage("Start date must be a valid datetime"),
  handleValidationErrors
];

//----------------------------- GET ALL EVENTS -----------------------------
//----------------------------- GET ALL EVENTS -----------------------------
//----------------------------- GET ALL EVENTS -----------------------------
//----------------------------- GET ALL EVENTS -----------------------------

router.get("/", validatePaginatorAndQueries, async (req, res) => {

  //PAGE THAT NATOR, QUERY THE DYNAMICS
  let { page, size, name, type, startDate } = req.query

  let queryObj = {
    order: [["name", "ASC"]],
    where: {},
  }

  if (name !== undefined) queryObj.where.name = name;
  if (type !== undefined) queryObj.where.type = type;
  // if (startDate !== undefined) queryObj.where.date = date

  if (!page || page > 10) page = 1;
  if (!size || size > 20) size = 20;

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
    ],
    limit: size,
    offset: (page - 1) * size,
    ...queryObj
  })

  for (let i = 0; i < events.length; i++) {
    let attendance = await Attendance.findAll({
      where: {
        eventId: events[i].id,
        status: {
          [Op.not]: "pending"
        }
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

  if (events.length === 0) events = null;

  res.status(200)
  return res.json({ Events: events })

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
  check('venueId')
    .exists({ checkFalsy: true })
    .custom(async value => {
      const venue = await Venue.findByPk(value);
      if (!venue) throw new Error();
    })
    .withMessage("Venue does not exist"),
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
  check("price")
    .exists({ checkFalsy: true })
    .isDecimal({ decimal_digits: 2 })
    .withMessage("Price is invalid"),
  check('startDate')
    .exists({ checkFalsy: true })
    .isAfter(Date.parse(Date.now()))
    .withMessage(`Start date must be in the future`),
  check('endDate')
    .exists({ checkFalsy: true })
    .isAfter(Date.parse(this.startDate))
    .withMessage(`End date must be after start date`),
  handleValidationErrors
];

//================================= PUT REQUESTS ================================

//------- CHANGE THE STATUS OF AN ATTENDANCE FOR AN EVENT SPECIFIED BY ID -------
//------- CHANGE THE STATUS OF AN ATTENDANCE FOR AN EVENT SPECIFIED BY ID -------
//------- CHANGE THE STATUS OF AN ATTENDANCE FOR AN EVENT SPECIFIED BY ID -------
//------- CHANGE THE STATUS OF AN ATTENDANCE FOR AN EVENT SPECIFIED BY ID -------

router.put("/:eventId/attendance", requireAuth, async (req, res) => {

  // log in check
  const { user } = req;
  if (!user) {
    res.status(401);
    return res.json({
      "message": "Authentication Required. Forgot to log in didn't you?"
    })
  }


  const { userId, status } = req.body
  const currUserId = user.dataValues.id;
  const eventId = req.params.eventId;

  let event = await Event.findByPk(eventId)

  if (!event) {
    res.status(404);
    return res.json({
      "message": "Event couldn't be found"
    })
  }

  if (status === "pending") {
    res.status(400);
    return res.json({
      "message": "Cannot change an attendance status to pending"
    })
  }

  let attendance = await Attendance.findOne({
    where: {
      eventId,
      userId,
    }
  })

  // console.log(attendance)

  if (!attendance) {
    res.status(400);
    return res.json({
      "message": "Attendance between the user and the event does not exist"
    })
  }

  let attendies = await Attendance.findAll({
    include: [
      {
        model: User,
        include: [
          {
            model: Groupe
          }
        ]
      },
      { model: Event }
    ],
    where: {
      eventId
    }
  })

  let cohostToken = false;
  for (let j = 0; j < attendies.length; j++) {
    for (let index = 0; index < attendies[j].User.dataValues.Groupes.length; index++) {
      if (currUserId === attendies[j].User.id && attendies[j].User.dataValues.Groupes[index].dataValues.Membership.dataValues.status === "co-host") cohostToken = true;
    }
  }


  let organToken = false
  for (let k = 0; k < attendies.length; k++) {
    for (let index = 0; index < attendies[k].dataValues.User.dataValues.Groupes.length; index++) {
      if (currUserId === attendies[k].dataValues.User.dataValues.Groupes[index].dataValues.organizerId) organToken = true;
    }
  }

  // console.log(cohostToken, organToken)

  if (status === "attending" && (organToken || cohostToken)) {
    attendance.status = status;
    await attendance.save();

    let findAtt = await Attendance.findOne({
      attributes: [
        "id",
        "eventId",
        "userId",
        "status"
      ],
      where: {
        userId,
        eventId,
        status,
      }
    })

    res.status(200);
    // return res.jston(findMember)
    return res.json(findAtt)
  }

  res.status(403);
  return res.json({
    "message": "You are not authorized to make that change"
  })

})

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

//------------- REQUEST TO ATTEND AN EVENT BASED ON THE EVENT'S ID -------------
//------------- REQUEST TO ATTEND AN EVENT BASED ON THE EVENT'S ID -------------
//------------- REQUEST TO ATTEND AN EVENT BASED ON THE EVENT'S ID -------------
//------------- REQUEST TO ATTEND AN EVENT BASED ON THE EVENT'S ID -------------

router.post("/:eventId/attendance", requireAuth, async (req, res) => {

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


  const event = await Event.findByPk(eventId);

  if (!event) {
    res.status(404)
    return res.json({
      "message": "Event couldn't be found"
    })
  }


  const isPending = await Attendance.findOne({
    where: {
      userId,
      eventId,
      status: "pending"
    }
  })

  if (isPending) {
    res.status(404);
    return res.json({
      "message": "Attendance has already been requested"
    })
  }

  const isTendie = await Attendance.findOne({
    where: {
      userId,
      eventId,
      status: "attending"
    }
  })

  if (isTendie) {
    res.status(404);
    return res.json({
      "message": "User is already a attendee of the group"
    })
  }
  //-------------------------------------------------------------------------

  await Attendance.bulkCreate([{
    userId,
    eventId,
    status: "pending",
  },
  ], { validate: true })

  let newTendieObj = {
    userId,
    status: "pending"
  }

  res.status(200);
  return res.json(newTendieObj)

})

//------------- ADD AN IMAGE TO A EVENT BASED ON THE EVENT'S ID ----------------
//------------- ADD AN IMAGE TO A EVENT BASED ON THE EVENT'S ID ----------------
//------------- ADD AN IMAGE TO A EVENT BASED ON THE EVENT'S ID ----------------
//------------- ADD AN IMAGE TO A EVENT BASED ON THE EVENT'S ID ----------------

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

// -------------- DELETE ATTENDANCE TO AN EVENT SPECIFIED BY ID ---------------
// -------------- DELETE ATTENDANCE TO AN EVENT SPECIFIED BY ID ---------------
// -------------- DELETE ATTENDANCE TO AN EVENT SPECIFIED BY ID ---------------
// -------------- DELETE ATTENDANCE TO AN EVENT SPECIFIED BY ID ---------------

router.delete("/:eventId/attendance", requireAuth, async (req, res) => {

  // log in check
  const { user } = req;
  if (!user) {
    res.status(401);
    return res.json({
      "message": "Authentication Required. Forgot to log in didn't you?"
    })
  }

  const currUserId = user.dataValues.id;
  const eventId = req.params.eventId;
  const { userId } = req.body

  let event = await Event.findByPk(eventId)

  if (!event) {
    res.status(404);
    return res.json({
      "message": "Event couldn't be found"
    })
  }

  let attendance = await Attendance.findOne({
    where: {
      eventId,
      userId,
    }
  })

  // console.log(attendance)

  if (!attendance) {
    res.status(400);
    return res.json({
      "message": "Attendance does not exist for this User"
    })
  }

  //-----------------------------------------------------------------

  let findCurrUser = await User.findByPk(currUserId, {
    include: [
      {
        model: Groupe
      }
    ]
  })

  let hostToken = false;
  // console.log(findCurrUser)
  for (let i = 0; i < findCurrUser.dataValues.Groupes.length; i++) {
    if (findCurrUser.dataValues.Groupes[i].dataValues.id === event.groupId && findCurrUser.dataValues.Groupes[i].dataValues.Membership.dataValues.status === "host") hostToken = true;
    // console.log(findCurrUser.dataValues.Groupes[i].dataValues.id)
    // console.log(findCurrUser.dataValues.Groupes[i].dataValues.Membership.dataValues.status)
  }

  let memberToken = false;

  if (userId === currUserId) memberToken = true;

  if (hostToken || memberToken) {
    await attendance.destroy();
    res.status(200);
    return res.json({
      "message": "Successfully deleted attendance from event"
    })
  } else {
    res.status(403);
    return res.json({
      "message": "You there buckeroo don't have the authorization for that"
    })
  }

})

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
