import React from "react";
import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as eventActions from "../../store/events";
import EventCard from "./EventCard";
import "./EventAndGroupeNav.css"
import "./event.css"

function EventSideNav() {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(eventActions.getAllEventsThunk())
  }, [dispatch])

  useEffect(() => {
    dispatch(eventActions.getOneEventThunk(3))
  }, [dispatch])

  // const getAll = (e) => {
  //   e.preventDefault();
  //   dispatch(groupeActions.getAllGroupesThunk());
  // }

  // onClick={getAll}

  const eventState = useSelector(state => (state.events))

  // console.log("groupsState", groupsState.allGroups)
  const eventStateArr = Object.values(eventState.allEvents)
  // console.log("array", groupsStateArr)

  return (
    <>
      <div className="allAndEverything">
        <div className="EventsAndGroupeLinks">
          <NavLink
            exact to="/events"
            className="NarEventNav"
          >
            <h2>Events</h2>
          </NavLink>
          <NavLink exact to="/groups" className="NarGroupNav">
            <h2>Groups</h2>
          </NavLink>
        </div>
        <div className="jokeText">
          <span>Events on MeetSup</span>
        </div>
        <div className="EGcards">
          {eventStateArr.map((event) => (
            <div key={event.id}>
              <EventCard event={event} />
            </div>
          ))}
        </div>
      </div>
    </>
  )

}

export default EventSideNav
