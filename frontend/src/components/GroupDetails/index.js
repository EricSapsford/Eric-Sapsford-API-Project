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

  const sessionUser = useSelector(state => state.session.user ? state.session.user : {});
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
  let sessionUserId;
  if (sessionUser) sessionUserId = sessionUser.id
  if (!sessionUser) {
    hideJoin = true;
  } else if (sessionUserId === organizerId) {
    hideJoin = true;
  } else {
    hideJoin = false;
  }

  let hideCRUD = true;
  if (!sessionUser) {
    hideCRUD = true;
  } else if (sessionUserId === organizerId) {
    hideCRUD = false;
  }

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

              {hideCRUD ? null : <div>
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
          <div>Upcoming Events (#)</div>
          <div> Past Events (#)</div>
        </div>
      </div>
    </>
  )
}

export default GroupDetails
