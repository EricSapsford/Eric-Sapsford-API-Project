import React from "react";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as groupeActions from "../../store/groupes";
import GroupCard from "./GroupeCard";

function EventAndGroupeNav({ }) {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(groupeActions.getAllGroupesThunk());
  }, [dispatch])

  // const getAll = (e) => {
  //   e.preventDefault();
  //   dispatch(groupeActions.getAllGroupesThunk());
  // }

  // onClick={getAll}

  const groupsState = useSelector((state) => (state.groups ? state.groups : {}))

  // console.log("groupsState", groupsState.allGroups)
  const groupsStateArr = Object.values(groupsState.allGroups)
  // console.log("array", groupsStateArr)

  return (
    <>
      <div className="allAndEverything">
        <div className="EventsAndGroupeLinks">
          <NavLink exact to="/groups">
            <h2>Groups</h2>
          </NavLink>
          <NavLink exact to="/events">
            <h2>Events</h2>
          </NavLink>
        </div>
        <div className="jokeText">
          <span>Groups on MeetUP</span>
        </div>
        <div className="cards">
          {groupsStateArr.map((groupe) => (
            <div key={groupe.id}>
              <GroupCard groupe={groupe} />
            </div>
          ))}
        </div>
      </div>
    </>
  )

}

export default EventAndGroupeNav
