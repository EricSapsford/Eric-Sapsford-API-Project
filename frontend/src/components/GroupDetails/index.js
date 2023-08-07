import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import * as groupeActions from "../../store/groupes";
import * as eventActions from "../../store/events";
import OpenModalButton from "../OpenModalButton";
import "./GroupDetails.css"
import DeleteGroupeModal from "../DeleteGroupeModal";
import EventCard from "../EventAndGroupeNav/EventCard";
import GeventCard from "./GeventCard";

function GroupDetails() {

  const dispatch = useDispatch()
  // const history = useHistory();
  const { groupId } = useParams();

  useEffect(() => {
    dispatch(groupeActions.getOneGroupeThunk(groupId));
  }, [dispatch, groupId]);

  useEffect(() => {
    dispatch(groupeActions.getAllGroupesThunk());
  }, [dispatch]);

  useEffect(() => {
    dispatch(eventActions.getOneEventThunk(3))
  })

  const sessionUser = useSelector(state => state.session.user ? state.session.user : {});
  const singleGroup = useSelector(state => state.groups.singleGroup ? state.groups.singleGroup : {});
  const groupe = useSelector(state => state.groups.singleGroup ? state.groups.singleGroup : {});
  const groupeImageArr = useSelector(state => state.groups.singleGroup.GroupImages ? state.groups.singleGroup.GroupImages : []);
  const eventsArr = useSelector(state => state.groups.singleGroup.Events ? state.groups.singleGroup.Events : [])
  // console.log("eventsArr", eventsArr)

  //------------------------------------ DATE -------------------------------------
  //------------------------------------ DATE -------------------------------------
  //------------------------------------ DATE -------------------------------------
  //------------------------------------ DATE -------------------------------------

  const date = new Date();
  const dateTrans = date.toISOString()
  // console.log("date", dateTrans)
  let upcomingArr = [];
  let pastArr = [];

  for (let i = 0; i < eventsArr.length; i++) {
    // console.log(eventsArr[i].startDate, `${dateTrans}`)
    // console.log(eventsArr[i].startDate < `${dateTrans}`)
    if (eventsArr[i].startDate < `${dateTrans}`) {
      pastArr.push(eventsArr[i])
    } else {
      upcomingArr.push(eventsArr[i])
    }
  }

  // console.log("upcoming", upcomingArr, "past", pastArr)


  function compare(a, b) {
    if (a.startDate < b.startDate) {
      return -1;
    }
    if (a.startDate > b.startDate) {
      return 1;
    }
    return 0
  }

  upcomingArr.sort(compare)
  pastArr.sort(compare)
  // console.log("sorted", upcomingArr)

  //------------------------------------ IMAGE ------------------------------------
  //------------------------------------ IMAGE ------------------------------------
  //------------------------------------ IMAGE ------------------------------------
  //------------------------------------ IMAGE ------------------------------------

  let imgUrl;
  let newImgArr;
  if (groupeImageArr.length) {
    newImgArr = groupeImageArr.filter(image => image.preview === true)
    // groupeImages.forEach((image) => {
    //   if (image.preview === true) {
    //     newImgArr.push
    //   }
    // })
    // console.log("groupeImages", groupeImages)
    // console.log("newImgArr", newImgArr)
    if (newImgArr.length) {
      imgUrl = newImgArr[0].url;
    } else {
      imgUrl = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
    }

  }

  //---------------------------------- ORGANIZER ----------------------------------
  //---------------------------------- ORGANIZER ----------------------------------
  //---------------------------------- ORGANIZER ----------------------------------
  //---------------------------------- ORGANIZER ----------------------------------
  const organizerId = singleGroup.organizerId;
  const organ = singleGroup.Organizer;
  let organFirst;
  let organLast;
  if (organ) {
    organFirst = singleGroup.Organizer.firstName;
    organLast = singleGroup.Organizer.lastName;
  }

  //----------------------------------- BUTTONS -----------------------------------
  //----------------------------------- BUTTONS -----------------------------------
  //----------------------------------- BUTTONS -----------------------------------
  //----------------------------------- BUTTONS -----------------------------------

  //NEED TO ADD LOGIC SO THAT THE JOIN BUTTON HIDES WHEN SOMEONE IS THE MEMBER
  let hideJoin = true;
  let sessionUserId;
  if (sessionUser) sessionUserId = sessionUser.id
  if (!sessionUser) {
    hideJoin = true;
  } else if (sessionUserId === organizerId) {
    hideJoin = true;
  } else if (sessionUserId !== organizerId) {
    hideJoin = false;
  } else {
    hideJoin = false
  }

  let hideCRUD = true;
  if (!sessionUser) {
    hideCRUD = true;
  } else if (sessionUserId === organizerId) {
    hideCRUD = false;
  }

  // const alert = () => {
  //   alert("Feature coming soon")
  // }

  return (
    <>
      <div className="GDnavParent">
        <div className="GDnavChild">
          <div>
            ← <NavLink className="GDnavLink" to="/groups" style={{ textDecoration: "none", color: "brown", }}>Groups</NavLink>
          </div>
        </div>
      </div>


      <div className="GDcard">
        <div className="GDgroupImgDiv">
          {imgUrl ? <img className="GDgroupImg" src={imgUrl}></img> : <img className="groupImg" src="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"></img>}
        </div>
        <div className="GDdetesDiv">
          <div className="GDdetes">
            <div className="GDname">{groupe.name}</div>
            <div className="GDlocation">{groupe.city}, {groupe.state}</div>
            <div className="GDeventAndIsPrivate">{groupe.numEvents} {groupe.numEvents === 1 ? "event" : "events"}· {groupe.private ? <span>Private</span> : <span>Public</span>}</div>
            <div className="GDorganizer">Organized by: {organFirst} {organLast}</div>
          </div>

          <div className="JCRUDparent">
            <div className="JCRUDchild">
              {hideJoin ? null : <div>
                <button className="join" disabled={true}>Join this group</button>
              </div>
              }

              {hideCRUD ? null : <div className="JCRUDinfant">
                <NavLink to={`/groups/${groupId}/events/new`}>
                  <button className="CRUD">Create event</button>
                </NavLink>
                <NavLink to={`/groups/${groupId}/edit`}>
                  <button className="CRUD">Update</button>
                </NavLink>
                <OpenModalButton
                  className="CRUD"
                  buttonText="Delete"
                  modalComponent={<DeleteGroupeModal groupId={groupId} />}
                />
              </div>
              }
            </div>
          </div>
        </div>
      </div>
      <div className="GDlowerHalf">
        <div className="GDlowerHalfDiv">
          <div className="GDorgan">Organizer</div>
          <div className="actualGDorgan">{organFirst} {organLast}</div>
          <div className="GDabout">What we're about</div>
          <div className="actualGDabout">{groupe.about}</div>
          <div>
            {upcomingArr.length ? <h2 style={{ color: "brown" }}>Upcoming Events · {upcomingArr.length}</h2> : <h2 style={{ color: "brown" }}>No Upcoming Events</h2>}
            {upcomingArr.map((event) => (
              <div key={event.id}>
                <GeventCard event={event} city={groupe.city} state={groupe.state} />
              </div>
            ))}

          </div>
          <div>
            {pastArr.length ? <h2 style={{ color: "brown" }}>Past Events · {pastArr.length}</h2> : null}
            {pastArr.map((event) => (
              <div key={event.id}>
                <GeventCard event={event} city={groupe.city} state={groupe.state} />
              </div>
            ))}

          </div>
        </div>
      </div>
    </>
  )
}

export default GroupDetails
