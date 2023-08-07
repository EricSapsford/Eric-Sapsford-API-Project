import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import * as eventActions from "../../store/events";
import * as groupActions from "../../store/groupes"
import OpenModalButton from "../OpenModalButton";
import "./EventDetails.css"
import DeleteEventModal from "../DeleteEventModal";


function EventDetails() {
  const dispatch = useDispatch();
  const { eventId } = useParams();
  // console.log("eventId", eventId)

  useEffect(() => {
    dispatch(eventActions.getAllEventsThunk());
    dispatch(groupActions.getAllGroupesThunk());
    dispatch(eventActions.getOneEventThunk(eventId));
  }, [dispatch, eventId]);

  const sessionUser = useSelector(state => state.session.user ? state.session.user : {});
  // const singleEvent = useSelector(state => state.events.singleEvent);
  // const singleGroup = useSelector(state => state.groups.singleGroup);

  //---------------------

  const event = useSelector(state => state.events.singleEvent);
  // console.log(event);
  // console.log("event", event)
  const eventImageArr = useSelector(state => state.events.singleEvent.EventImages ? state.events.singleEvent.EventImages : []);
  const groupeId = useSelector(state => state.events.singleEvent.groupId);
  // const allgroups = useSelector(state => state.groups.allGroups)
  // console.log("allgroups", allgroups)
  const allEvents = useSelector(state => state.events.allEvents)
  const eventAl = allEvents[eventId]
  const gROUp = eventAl.Groupe

  // console.log(group)
  // const groupeImg = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
  const groupeImgArr = useSelector(state => state.events.singleEvent.Group.images)
  // console.log(groupeImgArr)
  const groupeImg = groupeImgArr[0].url
  // console.log(groupeImg)

  //-------------------------



  // // const groupeId = event.groupId
  // // const groupeImg = useSelector(state => state.groups.allGroups[groupeId].previewImage);
  // // const organId = useSelector(state => state.groups.allGroups[groupeId].organizerId)
  // // const groupeImgArr = useSelector(state => state.groups.singleGroup.GroupImages ? state.groups.singleGroup.GroupImages : {})

  const organId = event.Group.organId
  // console.log("OID", organId)
  // console.log("organId", organId)
  // const organ = singleGroup.Organizer;
  const organFirst = event.Group.organFirst
  // console.log("organFirst", organFirst)
  const organLast = event.Group.organLast
  // if (organ) {
  //   organFirst = singleGroup.Organizer.firstName;
  //   organLast = singleGroup.Organizer.lastName;
  // }

  // useEffect(() => {
  //   const dodgeThis = async () => {
  //     await Promise.all([
  //       dispatch(eventActions.getOneEventThunk(eventId)),
  //       dispatch(eventActions.getAllEventsThunk()),
  //       dispatch(groupActions.getAllGroupesThunk()),
  //     ])
  //   }
  //   dodgeThis();
  // }, [dispatch, eventId])


  //------------------------------------ IMAGE ------------------------------------
  //------------------------------------ IMAGE ------------------------------------
  //------------------------------------ IMAGE ------------------------------------
  //------------------------------------ IMAGE ------------------------------------



  let imgUrl;
  let newImgArr;
  if (eventImageArr.length) {
    newImgArr = eventImageArr.filter(image => image.preview === true)
    if (newImgArr.length) {
      imgUrl = newImgArr[0].url;
    } else {
      imgUrl = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
    }
  }


  // // let anotherImgArr;
  // // if (groupeImgArr.length) {
  // //   anotherImgArr = groupeImgArr.filter(image => image.preview === true)
  // //   if (anotherImgArr.length) {
  // //     imgUrl = anotherImgArr[0].url;
  // //   } else {
  // //     groupeImg = "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"
  // //   }

  // // }

  //----------------------------------- BUTTONS -----------------------------------
  //----------------------------------- BUTTONS -----------------------------------
  //----------------------------------- BUTTONS -----------------------------------
  //----------------------------------- BUTTONS -----------------------------------

  let hideUD = true;
  let sessionUserId;
  if (sessionUser) sessionUserId = sessionUser.id
  if (!sessionUser) {
    hideUD = true;
  } else if (sessionUserId !== organId) {
    hideUD = true;
  } else {
    hideUD = false;
  }

  //------------------------------------ TIME -------------------------------------
  //------------------------------------ TIME -------------------------------------
  //------------------------------------ TIME -------------------------------------
  //------------------------------------ TIME -------------------------------------

  // let startDateRaw = ""
  // let endDateRaw = ""
  // let startDate = ""
  // let startTimeRaw = ""
  // let endDate = ""
  // let endTimeRaw = ""
  // console.log(event.startDate)

  let startDateRaw = event.startDate
  let endDateRaw = event.endDate
  let startDate = startDateRaw.slice(0, 10)
  let startTimeRaw = startDateRaw.slice(11, 22)
  let endDate = endDateRaw.slice(0, 10)
  let endTimeRaw = endDateRaw.slice(11, 22)


  return (
    <>
      <div className="EDheader">
        <div>
          ← <NavLink to="/events" style={{ textDecoration: "none", color: "brown" }}>Events</NavLink>
        </div>

        <div>
          <div className="EDName">{event.name}</div>
          <div className="EDOrganizer">Hosted by: {organFirst} {organLast}</div>
        </div>
      </div>

      <div className="EDlowerHalfDiv">
        <div className="EDlowerHalf">
          <div className="EDflexDiv">
            <div className="eventImg">
              {imgUrl ? <img className="EDimg" src={imgUrl}></img> : <img className="img" src="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"></img>}
            </div>

            <div className="EDrightCards">
              <div className="EDgroupCard">
                <NavLink className="EDnavLink" to={`/groups/${groupeId}`} style={{ textDecoration: "none" }}>
                  <div className="groupeDetes">
                    {/* <div className="EDgroupeImage"> */}
                    {groupeImg ? <img className="EDgroupImg" src={groupeImg}></img> : <img className="img" src="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"></img>}
                    {/* </div> */}
                    <div className="EDlilDetes">
                      <div className="EDgroupeName">{gROUp.name}</div>
                      <div className="EDIsPrivate">{event.private ? <span>Private</span> : <span>Public</span>}
                      </div>
                    </div>
                  </div>
                </NavLink>
              </div>


              <div className=" EDrightLowerCard">

                {/* time */}
                <div className="EDstartEnd">
                  <div className="EDstartEndIcon">
                    <i class="fa-regular fa-clock"></i>
                  </div>
                  <div className="EDstartEndWords">
                    <div className="start">
                      START {startDate} · {startTimeRaw}
                    </div>
                    <div className="end">
                      END {endDate} · {endTimeRaw}
                    </div>
                  </div>
                </div>


                {/* price */}
                <div className="EDprice">
                  <div className="EDpriceIcon">
                    <i class="fa-solid fa-dollar-sign"></i>
                  </div>
                  <div className="EDpriceWords">
                    <div className="price">
                      {event.price > 0 ? event.price : "FREE"}
                    </div>
                  </div>
                </div>


                {/* type */}
                <div className="EDtypeButtons">
                  <div className="EDtypeIcon">
                    {event.type === "Online" ? <i class="fa-solid fa-wifi"></i> : <i class="fa-solid fa-person"></i>}
                  </div>
                  <div className="EDtypeWords">
                    {event.type}
                  </div>
                  {/* <div className="Location">{groupe.city}, {groupe.state}</div> */}

                  <div className="EDCRUDdiv">
                    {hideUD ? null : <div className="EDCRUD">
                      <div>
                        <button disabled={true} className="EDupdateButton">Update</button>
                      </div>
                      <div>
                        <OpenModalButton
                          className="EDdeleteButton"
                          buttonText="Delete"
                          modalComponent={<DeleteEventModal eventId={eventId} />}
                        />
                      </div>

                    </div>
                    }
                  </div>
                </div>


              </div>
            </div>
          </div>

          <div className="EDabout">
            <div>
              <h2>Details</h2>
            </div>
            <div>
              {event.description ? <span>{event.description}</span> : <span>no about</span>}
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default EventDetails
