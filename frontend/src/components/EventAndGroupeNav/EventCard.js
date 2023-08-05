import React from "react";
// import { useEffect } from "react";
import { NavLink } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import * as groupeActions from "../../store/groupes";
import "./Card.css"

function EventCard({ event }) {

  let startDateRaw = event.startDate
  let date = startDateRaw.slice(0, 10)

  let timeRaw = startDateRaw.slice(11, 22)

  return (
    <NavLink to={`/events/${event.id}`}>
      <div>
        <div className="image">
          <img src={event.previewImage ? event.previewImage : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"} alt="Event Image" />
        </div>
        <div className="iddlybits">
          <div className="dateAndTime">
            {date} · {timeRaw}
          </div>
          <div className="name">
            {event.name}
          </div>
          <div className="location">
            {event.Groupe.city}, {event.Groupe.state}
          </div>
          <div className="blurb">
            {event.description ? <div>{event.description}</div> : <div>ADD DESCRIPTION TO GET ALL EVENTS ENDPOINT IN DATABASE</div>}
          </div>
        </div>
      </div>
    </NavLink>
  )
}

export default EventCard;
