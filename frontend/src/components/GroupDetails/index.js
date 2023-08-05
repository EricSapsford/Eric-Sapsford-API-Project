import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useHistory, useParams } from "react-router-dom";
import * as groupeActions from "../../store/groupes";
import OpenModalButton from "../OpenModalButton";
import "./GroupDetails.css"
import DeleteGroupeModal from "../DeleteGroupeModal";

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


  const sessionUser = useSelector(state => state.session.user);
  const singleGroup = useSelector(state => state.groups.singleGroup ? state.groups.singleGroup : {});
  const groupe = useSelector(state => state.groups.singleGroup ? state.groups.singleGroup : {});
  const groupeImageArr = useSelector(state => state.groups.singleGroup.GroupImages ? state.groups.singleGroup.GroupImages : []);

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
  const sessionUserId = sessionUser.id;
  if (!sessionUser) {
    hideJoin = true;
  } else if (sessionUserId === organizerId) {
    hideJoin = true;
  } else {
    hideJoin = false;
  }

  let hideCRUD;
  if (!sessionUser) {
    hideCRUD = true;
  } else if (sessionUserId === organizerId) {
    hideCRUD = false;
  }

  return (
    <>
      <div>
        ← <NavLink to="/groups">Groups</NavLink>
      </div>

      <div className="Card">
        <div className="groupImg">
          {imgUrl ? <img className="groupImg" src={imgUrl}></img> : <img className="groupImg" src="https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"></img>}
        </div>
        <div className="Detes">
          <div className="Name">{groupe.name}</div>
          <div className="Location">{groupe.city}, {groupe.state}</div>
          <div className="eventAndIsPrivate">//# OF EVENTS COMING SOON!// · {groupe.private ? <span>Private</span> : <span>Public</span>}</div>
          <div className="Organizer">Organized by: {organFirst} {organLast}</div>
        </div>

        {hideJoin ? null : <div className="join">
          <button>Join this group</button>
        </div>
        }

        {hideCRUD ? null : <div className="CRUD">
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
      <div className="lowerHalf">
        <div>
          <h2>Organizer</h2>
        </div>
        <div>{organFirst} {organLast}</div>
        <div>
          <h2>What we're about</h2>
        </div>
        <div>{groupe.about}</div>
        <div>Upcoming Events (#)</div>
        <div> Past Events (#)</div>
      </div>
    </>
  )
}

export default GroupDetails
