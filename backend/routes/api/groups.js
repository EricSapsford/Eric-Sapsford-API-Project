//============================== IMPORTS ==============================
const express = require("express");
const { Attendance, Event, EventImage, Groupe, GroupImage, Membership, User, Venue, sequelize } = require("../../db/models")
const { Op } = require("sequelize");

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');
const { group } = require("console");


const router = express.Router();
// const lastGroupe = {}

//======= FREEKY MIDDLEWARE TO FIX CREATE GROUPE PROBLEM IN FRONTEND =======




//=============================== END POINTS ===============================


//============================== GET REQUESTS ==============================

//------------- GET ALL MEMBERS OF A GROUPE SPECIFIED BY ITS ID -------------
//------------- GET ALL MEMBERS OF A GROUPE SPECIFIED BY ITS ID -------------
//------------- GET ALL MEMBERS OF A GROUPE SPECIFIED BY ITS ID -------------
//------------- GET ALL MEMBERS OF A GROUPE SPECIFIED BY ITS ID -------------

router.get("/:groupId/members", async (req, res) => {

  const { user } = req;
  const userId = user.dataValues.id;
  const groupId = req.params.groupId;

  let members = await Membership.findAll({
    include: [
      { model: User },
      { model: Groupe }
    ],
    where: {
      groupId
    }
  })

  // console.log("organ", members[0].dataValues.Groupe.dataValues.organizerId)
  // console.log("user", userId)

  // JUST IN CASE THIS IS MORE OF A NUCLEAR OPTION
  // const group = await Groupe.findByPk(groupId);

  // if (!group) {
  //   res.status(404)
  //   return res.json({
  //     "message": "Group couldn't be found"
  //   })
  // }


  if (members.length === 0) {
    res.status(404)
    return res.json({
      "message": "Group couldn't be found"
    })
  }

  // console.log(members);
  let cohostToken = 0;
  for (let j = 0; j < members.length; j++) {
    if (userId === members[j].User.id && members[j].status === "co-host") cohostToken++;
  }

  if (userId === members[0].dataValues.Groupe.dataValues.organizerId || cohostToken === 1) {

    let membersArr = [];
    for (let i = 0; i < members.length; i++) {
      let realId = await Membership.findOne({
        where: {
          userId: members[i].User.id,
          groupId,
        }
      })
      // console.log("****REALID****", realId);
      // console.log("hello")
      let membersObj = {
        id: realId.id,
        firstName: members[i].User.firstName,
        lastName: members[i].User.lastName,
        Membership: {
          status: members[i].status
        }
      }
      membersArr.push(membersObj);
    }

    res.status(200);
    return res.json({ Members: membersArr });
  } else {

    let membersArr = [];
    for (let i = 0; i < members.length; i++) {
      let realId = await Membership.findOne({
        where: {
          userId: members[i].User.id,
          groupId,
        }
      })
      let index = i;
      let currStatus = members[i].status
      console.log(currStatus)
      while (currStatus === "pending") {
        i++;
        if (i >= members.length) {
          i--;
          break;
        }
        currStatus = members[index + 1].status
      }
      let membersObj = {
        id: realId.id,
        firstName: members[i].User.firstName,
        lastName: members[i].User.lastName,
        Membership: {
          status: members[i].status
        }
      }
      membersArr.push(membersObj);
      if (membersArr[membersArr.length - 1].Membership.status === "pending") {
        membersArr.pop()
      }
    }

    res.status(200);
    return res.json({ Members: membersArr });
  }
})

//---------------- GET ALL EVENTS OF A GROUP SPECIFIED BY ITS ID ----------------
//---------------- GET ALL EVENTS OF A GROUP SPECIFIED BY ITS ID ----------------
//---------------- GET ALL EVENTS OF A GROUP SPECIFIED BY ITS ID ----------------
//---------------- GET ALL EVENTS OF A GROUP SPECIFIED BY ITS ID ----------------

router.get("/:groupId/events", async (req, res) => {

  const groupId = req.params.groupId;

  let errHandle = await Groupe.findByPk(groupId)

  if (!errHandle) {
    res.status(404);
    return res.json({
      "message": "Group does not exist"
    })
  }

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
        ],
        where: {
          id: groupId
        }
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
      events[index].dataValues.previewImage = false;
    };
  }

  // console.log("=====EVENTS=====", events)

  if (events.length === 0) events = null;

  res.status(200)
  return res.json({ Events: events })


});

//------------- GET ALL VENUES FOR A GROUPE SPECIFIED BY ITS ID ------------
//------------- GET ALL VENUES FOR A GROUPE SPECIFIED BY ITS ID ------------
//------------- GET ALL VENUES FOR A GROUPE SPECIFIED BY ITS ID ------------
//------------- GET ALL VENUES FOR A GROUPE SPECIFIED BY ITS ID ------------

/* EXISTING ISSUES WITH OUTPUT

- check what happens when a user of the appropriate groupId who is a co-host tries to edit

*/

router.get("/:groupId/venues", requireAuth, async (req, res) => {

  // log in check
  const { user } = req;
  if (!user) {
    res.status(401);
    return res.json({
      "message": "Authentication Required. Forgot to log in didn't you?"
    })
  }

  const userId = user.dataValues.id;
  const groupId = req.params.groupId;

  let findGroupe = await Groupe.findByPk(groupId);
  let userMembership = await Membership.findOne({
    where: {
      groupId,
      userId
    }
  });

  if (!userMembership) {
    res.status(403);
    return res.json({
      "message": "Whoa there buckeroo, that ain't yours"
    })
  }

  // console.log(findGroupe)
  // console.log(userMembership.status);

  // LET
  // THAT
  // DOG
  // OUT

  let dog = 0;
  if (userId === findGroupe.organizerId) dog++;
  console.log(dog);
  if (userMembership.status === "co-host") dog++;
  console.log(dog);
  if (dog === 0) {
    res.status(403);
    return res.json({
      "message": "Whoa there buckeroo, that ain't yours"
    })
  }

  // YOU WERE THE CHOSEN ONE! YOU WERE MEANT TO BRING BALANCE TO THE LOGIC, NOT DESTROY IT!
  // if (userId !== findGroupe.organizerId || userMembership.status !== "co-host") {
  //   res.status(403);
  //   res.json({
  //     "message": "Whoa there buckeroo, that ain't yours"
  //   })
  // };

  if (!findGroupe) {
    res.status(404)
    return res.json({
      "message": "Group couldn't be found"
    });
  };

  let venues = await Venue.findAll({
    attributes: [
      "id",
      "groupId",
      "address",
      "city",
      "state",
      "lat",
      "lng"
    ],
    where: {
      groupId,
    }
  });

  res.status(200);
  return res.json({ Venues: venues });


})

//-------- GET ALL GROUPES JOINED OR ORGANIZED BY THE CURRENT USER ---------
//-------- GET ALL GROUPES JOINED OR ORGANIZED BY THE CURRENT USER ---------
//-------- GET ALL GROUPES JOINED OR ORGANIZED BY THE CURRENT USER ---------
//-------- GET ALL GROUPES JOINED OR ORGANIZED BY THE CURRENT USER ---------

/* EXISTING ISSUES WITH OUTPUT

- set models createdAt and updatedAt to grab that date literal thing rather than the default

*/

router.get("/current", requireAuth, async (req, res) => {

  // log in check
  const { user } = req;
  if (!user) {
    res.status(401);
    return res.json({
      "message": "Authentication Required. Forgot to log in didn't you?"
    })
  }

  const userId = user.dataValues.id;

  let groups = await Groupe.findAll({
    include: [
      {
        model: Membership,
        attributes: [],
      },
      {
        model: GroupImage,
        attributes: [],
      }
    ],
    where: {
      organizerId: userId
    }
  })

  for (let i = 0; i < groups.length; i++) {
    let membership = await Membership.findAll({
      where: {
        groupId: groups[i].id
      }
    })

    groups[i].dataValues.numMembers = membership.length
  }

  for (let index = 0; index < groups.length; index++) {
    let image = await Groupe.findByPk(groups[index].id, {
      raw: true,
      include: [{
        model: GroupImage,
        where: {
          preview: true
        },
        attributes: ["url"]
      }]
    });

    if (image) {
      groups[index].dataValues.previewImage = image["GroupImages.url"];
    } else {
      groups[index].dataValues.previewImage = false;
    };
  }

  return res.json({
    //this feels wrong
    Groups: groups
  });
})



//------------------ GET DETAILS OF A GROUP FROM AN ID -------------------
//------------------ GET DETAILS OF A GROUP FROM AN ID -------------------
//------------------ GET DETAILS OF A GROUP FROM AN ID -------------------
//------------------ GET DETAILS OF A GROUP FROM AN ID -------------------

router.get("/:groupId", async (req, res) => {

  const { groupId } = req.params;

  // LIVING THAT BRUTAL LIFE
  const groupe = await Groupe.findByPk(groupId, {
    include: [
      { model: Membership },
      { model: User },
    ]
  })

  if (!groupe) {
    res.status(404);
    return res.json({
      "message": "Group couldn't be found"
    })
  }

  let numAttending = groupe.Memberships.length;

  let groupImages = await GroupImage.findAll({
    attributes: [
      "id",
      "url",
      "preview"
    ],
    where: {
      groupId,
    }
  })

  let organ = groupe.User
  let organObj = {
    id: organ.id,
    firstName: organ.firstName,
    lastName: organ.lastName
  }


  let venues = await Venue.findAll({
    attributes: [
      "id",
      "groupId",
      "address",
      "city",
      "state",
      "lat",
      "lng"
    ],
    where: {
      groupId,
    }
  });

  // COMPILE SPOOF
  let spoofGroupeObj = {
    id: groupe.id,
    organizerId: groupe.organizerId,
    name: groupe.name,
    about: groupe.about,
    type: groupe.type,
    private: groupe.private,
    city: groupe.city,
    state: groupe.state,
    createdAt: groupe.createdAt,
    updatedAt: groupe.updatedAt,
    numMembers: numAttending,
    GroupImages: groupImages,
    Organizer: organObj,
    Venues: venues
  }

  res.status(200);
  return res.json(spoofGroupeObj);

  // HELLO FROM THE FUTURE, THIS DOESN'T WORK LIKE IT LOOKED LIKE IT DID
  // NOW WE GOING BRUTAL
  // // Groupe base
  // let groupe = await Groupe.findByPk(groupId, {
  //   // raw: true;
  //   include: [{
  //     model: Membership,
  //     attributes: [],
  //     // where: { <-- because why the fuck would I need this?
  //     //   userId: user.id
  //     // }
  //   }],
  //   attributes: {
  //     // ^C ^V you sweet sweet succulent siren
  //     include: [
  //       [sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"]
  //     ]
  //   },
  //   group: ["Groupe.id"]
  // })

  // // Error Handler start, gross I know
  // if (groupe) {
  //   groupe = groupe.toJSON(); //<-- can't have this outside of the if for reasons

  //   //Organizer
  //   let organizer = await User.findByPk(groupe.organizerId, {
  //     attributes: ["id", "firstName", "lastName"]
  //   })

  //   //Venue
  //   let venue = await Venue.findAll({
  //     attributes: [
  //       "id",
  //       "groupId",
  //       "address",
  //       "city",
  //       "state",
  //       "lat",
  //       "lng"
  //     ],
  //     where: {
  //       groupId
  //     }
  //   })

  //   //GroupImages
  //   let groupImages = await GroupImage.findAll({
  //     attributes: [
  //       "id",
  //       "url",
  //       "preview"
  //     ],
  //     where: {
  //       groupId: req.params.groupId
  //     }
  //   })

  //   //Compile
  //   groupe.GroupImages = groupImages;
  //   groupe.Organizer = organizer;
  //   groupe.Venues = venue;


  //   // if (groupe) {
  //   return res.json({
  //     ...groupe
  //   });
  // } else {
  //   res.status(404);
  //   return res.json({
  //     "message": "Groupe couldn't be found"
  //   })
  // }
});



//------------------------------ GET ALL GROUPES --------------------------------
//------------------------------ GET ALL GROUPES --------------------------------
//------------------------------ GET ALL GROUPES --------------------------------
//------------------------------ GET ALL GROUPES --------------------------------

/* EXISTING ISSUES WITH OUTPUT

- set models createdAt and updatedAt to grab that date literal thing rather than the default

*/

router.get("/", async (req, res) => {

  let groups = await Groupe.findAll({
    include: [
      {
        model: Membership,
        attributes: [],
      },
      {
        model: GroupImage,
        attributes: [],
      },
      {
        model: Event,
        attributes: [],
      }
    ]
  })

  for (let i = 0; i < groups.length; i++) {
    let membership = await Membership.findAll({
      where: {
        groupId: groups[i].id
      }
    })

    groups[i].dataValues.numMembers = membership.length
  }

  for (let j = 0; j < groups.length; j++) {
    let event = await Event.findAll({
      where: {
        groupId: groups[j].id
      }
    })
    groups[j].dataValues.numEvents = event.length
  }

  for (let index = 0; index < groups.length; index++) {
    let image = await Groupe.findByPk(groups[index].id, {
      raw: true,
      include: [{
        model: GroupImage,
        where: {
          preview: true
        },
        attributes: ["url"]
      }]
    });

    if (image) {
      groups[index].dataValues.previewImage = image["GroupImages.url"];
    } else {
      groups[index].dataValues.previewImage = false;
    };
  }

  return res.json({
    //this feels wrong
    Groups: groups
  });

})

//============================= DELETE REQUESTS =================================

//--------------- DELETE MEMBERSHIP TO A GROUP SPECIFIED BY ID ------------------
//--------------- DELETE MEMBERSHIP TO A GROUP SPECIFIED BY ID ------------------
//--------------- DELETE MEMBERSHIP TO A GROUP SPECIFIED BY ID ------------------
//--------------- DELETE MEMBERSHIP TO A GROUP SPECIFIED BY ID ------------------

router.delete("/:groupId/membership", requireAuth, async (req, res) => {

  // log in check
  const { user } = req;
  if (!user) {
    res.status(401);
    return res.json({
      "message": "Authentication Required. Forgot to log in didn't you?"
    })
  }

  const currUserId = user.dataValues.id;
  const groupId = req.params.groupId;
  const { memberId } = req.body

  let groupe = await Groupe.findByPk(groupId)

  if (!groupe) {
    res.status(404);
    return res.json({
      "message": "Group couldn't be found"
    })
  }

  let memUser = await Membership.findByPk(memberId);

  if (!memUser) {
    res.status(400);
    return res.json({
      message: "Validation Error",
      errors: {
        memberId: "User couldn't be found"
      }
    })
  }

  let membership = await Membership.findOne({
    where: {
      groupId,
      id: memberId
    }
  })

  if (!membership) {
    res.status(404);
    return res.json({
      "message": "Membership does not exist for this User"
    })
  }

  let currUserMembership = await Membership.findOne({
    where: {
      userId: currUserId,
      groupId: groupId
    }
  })

  if (!currUserMembership) {
    res.status(404);
    res.json({
      "message": "You there buckeroo don't have the authorization for that"
    })
  } else if (currUserMembership.status === "host" || membership.userId === currUserId) {
    await membership.destroy();
    res.status(200);
    return res.json({
      "message": "Successfully deleted"
    })
  } else {
    res.status(403);
    return res.json({
      "message": "You there buckeroo don't have the authorization for that"
    })
  }

})

//----------------------------- DELETE A GROUPE ---------------------------------
//----------------------------- DELETE A GROUPE ---------------------------------
//----------------------------- DELETE A GROUPE ---------------------------------
//----------------------------- DELETE A GROUPE ---------------------------------

router.delete("/:groupId", requireAuth, async (req, res) => {

  // log in check
  const { user } = req;
  if (!user) {
    res.status(401);
    return res.json({
      "message": "Authentication Required. Forgot to log in didn't you?"
    })
  }

  const userId = user.dataValues.id;
  const groupId = req.params.groupId;

  const group = await Groupe.findByPk(groupId);

  if (group) {
    if (group.organizerId === userId) {
      await group.destroy();
      res.status(200)
      return res.json({
        "message": "Successfully deleted",
      })
    } else {
      res.status(403);
      return res.json({
        "message": "Whoa there buckeroo, that ain't yours"
      })
    }
  } else {
    res.status(404);
    return res.json({
      "message": "Group couldn't be found"
    })
  }
})

//_______________________________ validator ________________________________

const validateGroupe = [
  check("name")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Name is required"),
  check("about")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("About is required"),
  check("type")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Type is required"),
  check("private")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Private is required"),
  check("city")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("State is required"),
  check("name")
    .exists({ checkFalsy: true })
    .isLength({ max: 60 })
    .withMessage("Name must be 60 characters of less"),
  check("about")
    .exists({ checkFalsy: true })
    .isLength({ min: 50 })
    .withMessage("About must be 50 characters or more"),
  check("type")
    .exists({ checkFalsy: true })
    .isIn(["Online", "In person"])
    .withMessage("Type must be 'Online' or 'In person"),
  check("private")
    .exists({ checkFalsy: true })
    .isBoolean()
    .withMessage("Private must be a boolean"),
  handleValidationErrors
];

//__________________________________ validator __________________________________

const validateVenue = [
  check("address")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Address is required"),
  check("city")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("City is required"),
  check("state")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("State is required"),
  check("lat")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Latitude is required"),
  check("lng")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Longitude is required"),
  check("lat")
    //shame I can't use isLatLong()
    .exists({ checkFalsy: true })
    .isFloat({ min: -90.0000000, max: 90.0000000 })
    .withMessage("Latitude is not valid"),
  check("lng")
    .exists({ checkFalsy: true })
    .isFloat({ min: -180.0000000, max: 180.0000000 })
    .withMessage("Longitude is not valid"),
  handleValidationErrors
];

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
    .isDecimal()
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

//============================== PUT REQUESTS ===================================

//------- CHANGE THE STATUS OF A MEMBERSHIP FOR A GROUPE SPECIFIED BY ID  -------
//------- CHANGE THE STATUS OF A MEMBERSHIP FOR A GROUPE SPECIFIED BY ID  -------
//------- CHANGE THE STATUS OF A MEMBERSHIP FOR A GROUPE SPECIFIED BY ID  -------
//------- CHANGE THE STATUS OF A MEMBERSHIP FOR A GROUPE SPECIFIED BY ID  -------

router.put("/:groupId/membership", requireAuth, async (req, res) => {

  // log in check
  const { user } = req;
  if (!user) {
    res.status(401);
    return res.json({
      "message": "Authentication Required. Forgot to log in didn't you?"
    })
  }

  const { memberId, status } = req.body
  const userId = user.dataValues.id;
  const groupId = req.params.groupId;

  let groupe = await Groupe.findByPk(groupId)

  // console.log(groupe);

  if (!groupe) {
    res.status(404);
    return res.json({
      "message": "Group couldn't be found"
    })
  }

  if (status === "pending") {
    res.status(400);
    return res.json({
      message: "Validation Error",
      errors: {
        status: "Cannot change a membership status to pending"
      }
    })
  }

  let memUser = await Membership.findByPk(memberId, {
    where: {
      userId: userId
    }
  });

  if (!memUser) {
    res.status(400);
    return res.json({
      message: "Validation Error",
      errors: {
        memberId: "User couldn't be found"
      }
    })
  }

  let membership = await Membership.findByPk(memberId, {
    where: {
      groupId: groupId
    }
  })

  // console.log(membership.groupId);

  if (!membership) {
    res.status(400);
    return res.json({
      "message": "Membership between the user and the group does not exist"
    })
  }

  if (status === "member" && membership.status === "member") {
    res.status(400);
    return res.json({
      "message": "User is already a member of the group"
    })
  }


  let organToken = false;
  let hostCohost = false;

  let edgecaseMembership = await Membership.findOne({
    where: {
      userId: userId,
      groupId: membership.groupId
    }
  })

  if (!edgecaseMembership) {
    res.status(403);
    res.json({
      "message": "That member does not belong to this group"
    })
  }

  let currUserMembership = await Membership.findOne({
    where: {
      userId: userId,
      groupId: groupId
    }
  })

  if (!currUserMembership) {
    res.status(404);
    res.json({
      "message": "You don't belong to this group"
    })
  } else if (currUserMembership.status === "host" || currUserMembership.status === "co-host") {
    hostCohost = true;
  }

  if (userId === groupe.organizerId) organToken = true;

  if (status === "member" && (organToken || hostCohost)) {
    membership.status = status;
    await membership.save();

    // let findMember = await Membership.findOne({
    //   where: {
    //     id: memberId,
    //     groupId,
    //   }
    // })

    let memObj = {
      memberId,
      status,
    }

    res.status(200);
    // return res.jston(findMember)
    return res.json(memObj)
  }

  if (status === "co-host" && organToken) {
    membership.status = status;
    await membership.save();

    // let findMember = await Membership.findOne({
    //   where: {
    //     id: memberId,
    //     groupId,
    //   }
    // })

    let memObj = {
      memberId,
      status,
    }

    res.status(200);
    // return res.json(findMember)
    return res.json(memObj)
  }

  res.status(403);
  return res.json({
    "message": "You are not authorized to make that change"
  })
})

//------------------------------ EDIT A GROUP -----------------------------------
//------------------------------ EDIT A GROUP -----------------------------------
//------------------------------ EDIT A GROUP -----------------------------------
//------------------------------ EDIT A GROUP -----------------------------------

router.put("/:groupId", requireAuth, validateGroupe, async (req, res) => {

  // log in check
  const { user } = req;
  if (!user) {
    res.status(401);
    return res.json({
      "message": "Authentication Required. Forgot to log in didn't you?"
    })
  }

  const userId = user.dataValues.id;
  const groupId = req.params.groupId;
  const { name, about, type, private, city, state } = req.body;
  // const organizerId = user.dataValues.id

  let groupe = await Groupe.findByPk(groupId)

  if (groupe) {
    if (groupe.organizerId === userId) {
      // UPDATeR
      groupe.name = name;
      groupe.about = about;
      groupe.type = type;
      groupe.private = private;
      groupe.city = city;
      groupe.state = state;
      await groupe.save(); // <-- validator is in here

      let findGroupe = await Groupe.findByPk(groupId)

      res.status(200)
      // res.jston // JOHNSTON!
      return res.json(findGroupe);
    } else {
      res.status(403);
      res.json({
        "message": "Whoa there buckeroo, that ain't yours"
      })
    }
  } else {
    res.status(404);
    return res.json({
      "message": "Group couldn't be found"
    })
  }
})


//============================== POST REQUESTS ==================================

//----------- REQUEST A MEMBERSHIP FOR A GROUP BASED ON THE GROUP'S ID ----------
//----------- REQUEST A MEMBERSHIP FOR A GROUP BASED ON THE GROUP'S ID ----------
//----------- REQUEST A MEMBERSHIP FOR A GROUP BASED ON THE GROUP'S ID ----------
//----------- REQUEST A MEMBERSHIP FOR A GROUP BASED ON THE GROUP'S ID ----------

router.post("/:groupId/membership", requireAuth, async (req, res) => {

  // log in check
  const { user } = req;
  if (!user) {
    res.status(401);
    return res.json({
      "message": "Authentication Required. Forgot to log in didn't you?"
    })
  }


  const userId = user.dataValues.id;
  const groupId = req.params.groupId;

  const group = await Groupe.findByPk(groupId);

  if (!group) {
    res.status(404)
    return res.json({
      "message": "Group couldn't be found"
    })
  }

  const isPending = await Membership.findOne({
    where: {
      userId,
      groupId,
      status: "pending"
    }
  })

  if (isPending) {
    res.status(404);
    return res.json({
      "message": "Membership has already been requested"
    })
  }

  const isMember = await Membership.findOne({
    where: {
      userId,
      groupId,
    }
  })

  if (isMember) {
    res.status(404);
    return res.json({
      "message": "User is already a member of the group"
    })
  }

  await Membership.bulkCreate([{
    userId,
    groupId,
    status: "pending",
  },
  ], { validate: true })

  let realId = await Membership.findOne({
    where: {
      groupId: groupId,
      userId: userId
    }
  })

  let newMemberObj = {
    memberId: realId.id,
    status: "pending"
  }

  res.status(200);
  return res.json(newMemberObj)

})



//-------------- CREATE AN EVENT FOR A GROUPE SPECIFIED BY ITS ID ---------------
//-------------- CREATE AN EVENT FOR A GROUPE SPECIFIED BY ITS ID ---------------
//-------------- CREATE AN EVENT FOR A GROUPE SPECIFIED BY ITS ID ---------------
//-------------- CREATE AN EVENT FOR A GROUPE SPECIFIED BY ITS ID ---------------



router.post("/:groupId/events", requireAuth, validateEvent, async (req, res) => {

  // body("startDate").custom(async value => {
  //   const date = new Date();
  //   let currentDay = String(date.getDate()).padStart(2, '0');
  //   let currentMonth = String(date.getMonth() + 1).padStart(2, "0");
  //   let currentYear = date.getFullYear();
  //   let currentHour = String(date.getHours());
  //   let currentMin = String(date.getMinutes());
  //   let currentSec = String(date.getSeconds());
  //   if (value < )

  //   let currentDate = `${currentYear}-${currentMonth}-${currentDay} ${currentHour}:${currentMin}:${currentSec}`
  // }),

  // check("venueId")
  //   .custom(async req => {
  //     const { venueId } = req.body
  //     const validVenue = await Venue.findByPk(venueId)
  //     if (!validVenue) {
  //       throw new Error();
  //     }
  //   })
  //   .withMessage("Venue does not exist")

  // log in check
  const { user } = req;
  if (!user) {
    res.status(401);
    return res.json({
      "message": "Authentication Required. Forgot to log in didn't you?"
    })
  }


  const { venueId, name, type, private, capacity, price, description, startDate, endDate } = req.body

  // // same thing but removed venueId for frontend project
  // const { name, type, private, capacity, price, description, startDate, endDate } = req.body

  const userId = user.dataValues.id;
  const groupId = req.params.groupId;

  /*
  *************************************************************************
  CURRENT USER MUST BE THE ORGANIZER OF THE GROUPE OR A MEMBER OF THE GROUP
  WITH A STATUS OF "CO-HOST"
  *************************************************************************
  */

  let findGroupe = await Groupe.findByPk(groupId);

  if (!findGroupe) {
    res.status(404);
    return res.json({
      "message": "Group couldn't be found"
    })
  }

  let userMembership = await Membership.findOne({
    where: {
      groupId,
      userId
    }
  });

  if (!userMembership) {
    res.status(403);
    return res.json({
      "message": "Whoa there buckeroo, that ain't yours"
    })
  }

  // LET
  // THAT
  // DOG
  // OUT

  let dog = 0;
  if (userId === findGroupe.organizerId) dog++;
  // console.log(dog);
  if (userMembership.status === "co-host") dog++;
  // console.log(dog);
  if (dog === 0) {
    res.status(403);
    return res.json({
      "message": "Whoa there buckeroo, that ain't yours"
    })
  }

  /*
  *************************************************************************
  CURRENT USER MUST BE THE ORGANIZER OF THE GROUPE OR A MEMBER OF THE GROUP
  WITH A STATUS OF "CO-HOST"
  *************************************************************************
  */

  const dirtyEvent = await Event.findOne({
    order: [['id', 'DESC']],
  });
  const dirtyEventIdInc = dirtyEvent.dataValues.id++;

  await Event.bulkCreate([{
    groupId,
    venueId,
    name,
    type,
    private,
    capacity,
    price,
    description,
    startDate,
    endDate,
  },
  ], { validate: true })

  // let findNewEvent = await Event.findOne({
  //   attributes: [
  //     "id",
  //     "groupId",
  //     "venueId",
  //     "name",
  //     "type",
  //     "private",
  //     "capacity",
  //     "price",
  //     "description",
  //     "startDate",
  //     "endDate"
  //   ],
  //   where: {
  //     venueId,
  //     name,
  //     type,
  //     private,
  //     capacity,
  //     price,
  //     description,
  //     startDate,
  //     endDate
  //   }
  // });

  let findNewEvent = await Event.findByPk(dirtyEventIdInc, {
    attributes: [
      "id",
      "groupId",
      "venueId",
      "name",
      "type",
      "private",
      "capacity",
      "price",
      "description",
      "startDate",
      "endDate"
    ]
  })

  res.status(201);
  return res.json(findNewEvent);

});

//------------ CREATE A NEW VENUE FOR A GROUPE SPECIFIED BY ITS ID --------------
//------------ CREATE A NEW VENUE FOR A GROUPE SPECIFIED BY ITS ID --------------
//------------ CREATE A NEW VENUE FOR A GROUPE SPECIFIED BY ITS ID --------------
//------------ CREATE A NEW VENUE FOR A GROUPE SPECIFIED BY ITS ID --------------

router.post("/:groupId/venues", requireAuth, validateVenue, async (req, res) => {

  // log in check
  const { user } = req;
  if (!user) {
    res.status(401);
    return res.json({
      "message": "Authentication Required. Forgot to log in didn't you?"
    })
  }

  const { address, city, state, lat, lng } = req.body

  const userId = user.dataValues.id;
  const groupId = req.params.groupId;

  /*
  *************************************************************************
  CURRENT USER MUST BE THE ORGANIZER OF THE GROUPE OR A MEMBER OF THE GROUP
  WITH A STATUS OF "CO-HOST"
  *************************************************************************
  */

  let findGroupe = await Groupe.findByPk(groupId);

  if (!findGroupe) {
    res.status(404);
    return res.json({
      "message": "Group couldn't be found"
    })
  }

  let userMembership = await Membership.findOne({
    where: {
      groupId,
      userId
    }
  });

  if (!userMembership) {
    res.status(403);
    return res.json({
      "message": "Whoa there buckeroo, that ain't yours"
    })
  }

  // LET
  // THAT
  // DOG
  // OUT

  let dog = 0;
  if (userId === findGroupe.organizerId) dog++;
  // console.log(dog);
  if (userMembership.status === "co-host") dog++;
  // console.log(dog);
  if (dog === 0) {
    res.status(403);
    return res.json({
      "message": "Whoa there buckeroo, that ain't yours"
    })
  }

  /*
  *************************************************************************
  CURRENT USER MUST BE THE ORGANIZER OF THE GROUPE OR A MEMBER OF THE GROUP
  WITH A STATUS OF "CO-HOST"
  *************************************************************************
  */


  await Venue.bulkCreate([{
    groupId,
    address,
    city,
    state,
    lat,
    lng
  },
  ], { validate: true })

  let findNewVenue = await Venue.findOne({
    attributes: [
      "id",
      "groupId",
      "address",
      "city",
      "state",
      "lat",
      "lng"
    ],
    where: {
      groupId,
      address,
      city,
      state,
      lat,
      lng
    }
  })

  res.status(201);
  return res.json(findNewVenue)

})


//------------- ADD AN IMAGE TO A GROUPE BASED ON THE GROUPE'S ID ---------------
//------------- ADD AN IMAGE TO A GROUPE BASED ON THE GROUPE'S ID ---------------
//------------- ADD AN IMAGE TO A GROUPE BASED ON THE GROUPE'S ID ---------------
//------------- ADD AN IMAGE TO A GROUPE BASED ON THE GROUPE'S ID ---------------

router.post("/:groupeId/images", requireAuth, async (req, res) => {

  // log in check
  const { user } = req;
  if (!user) {
    res.status(401);
    return res.json({
      "message": "Authentication Required. Forgot to log in didn't you?"
    })
  }

  // console.log(user)

  const userId = user.dataValues.id;
  const groupeId = req.params.groupeId;

  const { url, preview } = req.body;

  let groupe = await Groupe.findByPk(groupeId);
  console.log(groupeId);

  if (groupe) {
    if (groupe.organizerId === userId) {
      if (!preview) preview = false;

      await GroupImage.bulkCreate([{
        groupId: groupeId,
        url,
        preview
      },
      ], { validate: true });

      // THIS ONLY WORKS SO LONG AS THE URL AS IS UNIQUE
      const newImage = await GroupImage.findOne({
        attributes: [
          "id",
          "url",
          "preview"
        ],
        where: {
          groupId: groupeId,
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
  } else {
    res.status(404);
    return res.json({
      "message": "Group couldn't be found"
    });
  }
})

//---------------------------- CREATE A GROUPE -----------------------------
//---------------------------- CREATE A GROUPE -----------------------------
//---------------------------- CREATE A GROUPE -----------------------------
//---------------------------- CREATE A GROUPE -----------------------------


router.post("/", requireAuth, validateGroupe, async (req, res) => {

  // log in check
  const { user } = req;
  if (!user) {
    res.status(401);
    return res.json({
      "message": "Authentication Required. Forgot to log in didn't you?"
    })
  }

  const { name, about, type, private, city, state } = req.body;
  const organizerId = user.dataValues.id

  // THIS WILL ONLY WORK AS A STOPGAP
  // WE'LL NEED TO FIND A MORE FOOLPROOF AND LOGICAL SOLUTION
  // WHEN WE CREATE THE THE DELETE THUNK
  const dirtyGroup = await Groupe.findOne({
    order: [['id', 'DESC']],
  });
  const dirtyGroupIdInc = dirtyGroup.dataValues.id++;


  //let newGroup = //well look who doesn't need to exist?
  await Groupe.bulkCreate([{
    organizerId,
    name,
    about,
    type,
    private,
    city,
    state,
  },
  ], { validate: true });

  // WE NEED TO FIND A BETTER WAY
  // let foundGroupe = await Groupe.findOne({
  //   where: {
  //     organizerId,
  //     name,
  //     about,
  //     type,
  //     private,
  //     city,
  //     state,
  //   }
  // });

  const foundGroupe = await Groupe.findByPk(dirtyGroupIdInc)

  let foundGroupeId = foundGroupe.dataValues.id;


  await Membership.bulkCreate([{
    userId: organizerId,
    groupId: foundGroupeId,
    status: "host",
  },
  ], { validate: true })

  // create corresponding Membership
  res.status(201);
  return res.json(foundGroupe);
  //get fucked

})

module.exports = router;
