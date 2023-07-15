//============================== IMPORTS ==============================
const express = require("express");
const { Attendance, Event, EventImage, Groupe, GroupImage, Membership, User, Venue, sequelize } = require("../../db/models")
const { Op } = require("sequelize");

const { check } = require('express-validator');
const { handleValidationErrors } = require('../../utils/validation');
const { setTokenCookie, requireAuth } = require('../../utils/auth');


const router = express.Router();

//=============================== END POINTS ===============================


//============================== GET REQUESTS ==============================

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
  const { user } = req

  let groupes = await Groupe.findAll({
    raw: true,
    include: [{
      model: Membership,
      attributes: [],
      where: {
        userId: user.id
      }
    }],
    attributes: {
      // ^C ^V you sweet sweet siren
      include: [
        [sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"]
      ]
    },
    group: ["Groupe.id"]
  })

  //copypaste from get all down there
  //_____________________________________________________
  for (let index = 0; index < groupes.length; index++) {
    // let image = await Groupe.findall(
    let image = await Groupe.findByPk(groupes[index].id, {
      raw: true,
      include: [{
        model: GroupImage,
        where: {
          preview: true
        },
        attributes: ["url"]
      }]
    });

    groupes[index].numMembers = Number(groupes[index].numMembers);

    if (image) {
      groupes[index].previewImage = image["GroupImages.url"];
    } else {
      groupes[index].previewImage = "preview does not exist";
    };
  }
  //_____________________________________________________

  return res.json({
    //this will ALWAYS feel wrong
    Groups: groupes
  });
})



//------------------ GET DETAILS OF A GROUP FROM AN ID -------------------
//------------------ GET DETAILS OF A GROUP FROM AN ID -------------------
//------------------ GET DETAILS OF A GROUP FROM AN ID -------------------
//------------------ GET DETAILS OF A GROUP FROM AN ID -------------------

router.get("/:groupId", async (req, res) => {
  const { groupId } = req.params;

  // Groupe base
  let groupe = await Groupe.findByPk(groupId, {
    // raw: true;
    include: [{
      model: Membership,
      attributes: [],
      // where: { <-- because why the fuck would I need this?
      //   userId: user.id
      // }
    }],
    attributes: {
      // ^C ^V you sweet sweet succulent siren
      include: [
        [sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"]
      ]
    },
    group: ["Groupe.id"]
  })

  // Error Handler start, gross I know
  if (groupe) {
    groupe = groupe.toJSON(); //<-- can't have this outside of the if for reasons

    //Organizer
    let organizer = await User.findByPk(groupe.organizerId, {
      attributes: ["id", "firstName", "lastName"]
    })

    //Venue
    let venue = await Venue.findAll({
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
        groupId
      }
    })

    //GroupImages
    let groupImages = await GroupImage.findAll({
      attributes: [
        "id",
        "url",
        "preview"
      ],
      where: {
        groupId: req.params.groupId
      }
    })

    //Compile
    groupe.GroupImages = groupImages;
    groupe.Organizer = organizer;
    groupe.Venues = venue;


    // if (groupe) {
    return res.json({
      ...groupe
    });
  } else {
    res.status(404);
    return res.json({
      "message": "Groupe couldn't be found"
    })
  }
})



//------------------------------ GET ALL GROUPES --------------------------------
//------------------------------ GET ALL GROUPES --------------------------------
//------------------------------ GET ALL GROUPES --------------------------------
//------------------------------ GET ALL GROUPES --------------------------------

/* EXISTING ISSUES WITH OUTPUT

- set models createdAt and updatedAt to grab that date literal thing rather than the default

*/

router.get("/", async (req, res) => {

  let groupes = await Groupe.findAll({
    raw: true,
    include: [{
      model: Membership,
      attributes: []
    }],
    attributes: {
      include: [
        // fuck for loops
        // FUCK WHILE LOOPS
        // sequelize.fn("COUNT", sequelize.col("Memberships.id")), "AS" "numMembers"
        [sequelize.fn("COUNT", sequelize.col("Memberships.id")), "numMembers"]
      ]
    },
    //Groupe.id <-- you dumb fuck
    group: ["Groupe.id"]
  });

  // THEY SAY WE LAZY LOAD WE LAZY LOAD

  for (let index = 0; index < groupes.length; index++) {
    // let image = await Groupe.findall(
    let image = await Groupe.findByPk(groupes[index].id, {
      raw: true,
      include: [{
        model: GroupImage,
        where: {
          preview: true
        },
        attributes: ["url"]
      }]
    });

    groupes[index].numMembers = Number(groupes[index].numMembers);

    if (image) {
      groupes[index].previewImage = image["GroupImages.url"];
    } else {
      groupes[index].previewImage = "preview does not exist";
    };
  }

  return res.json({
    //this feels wrong
    Groups: groupes
  });

})

//============================= DELETE REQUESTS =================================

//----------------------------- DELETE A GROUPE ---------------------------------
//----------------------------- DELETE A GROUPE ---------------------------------
//----------------------------- DELETE A GROUPE ---------------------------------
//----------------------------- DELETE A GROUPE ---------------------------------

router.delete("/:groupeId", requireAuth, async (req, res) => {

  // log in check
  const { user } = req;
  if (!user) {
    res.status(401);
    return res.json({
      "message": "Authentication Required. Forgot to log in didn't you?"
    })
  }

  const userId = user.dataValues.id;
  const groupeId = req.params.groupeId;

  const groupe = await Groupe.findByPk(groupeId);

  if (groupe) {
    if (groupe.organizerId === userId) {
      await groupe.destroy();
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

//============================== PUT REQUESTS ===================================

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
  console.log(dog);
  if (userMembership.status === "co-host") dog++;
  console.log(dog);
  if (dog === 0) {
    res.status(403);
    return res.json({
      "message": "Whoa there buckeroo, that ain't yours"
    })
  }

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
  const groupeId = req.params.groupeId; // <-- seriously stop destructuring these

  const { url, preview } = req.body;

  let groupe = await Groupe.findByPk(groupeId);
  console.log(groupeId);

  if (groupe) {
    if (groupe.organizerId === userId) {
      if (!preview) preview = false;

      const newImage = await GroupImage.create({
        groupeId,
        url,
        preview
      });

      return res.json({
        id: newImage.id,
        url: newImage.url,
        preivew: newImage.preview
      });
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

  let pleaseForTheLoveOfGodWhereAreYouGroupe = await Groupe.findOne({
    where: {
      //you
      organizerId,
      //cannot
      name,
      //hide
      about,
      //from
      type,
      //me
      private,
      //I
      city,
      //OWN
      state,
      //YOU
    }
  });

  let pleaseForTheLoveOfGodWhereAreYouGroupeId = pleaseForTheLoveOfGodWhereAreYouGroupe.id;
  // create corresponding Membership
  await Membership.bulkCreate(
    {
      userId: organizerId,
      groupId: pleaseForTheLoveOfGodWhereAreYouGroupeId,
      status: "host",
    });

  res.status(201);
  return res.json(pleaseForTheLoveOfGodWhereAreYouGroupe);
  //get fucked

})

module.exports = router;
