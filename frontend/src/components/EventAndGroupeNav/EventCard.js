import React from "react";
// import { useEffect } from "react";
import { NavLink } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import * as groupeActions from "../../store/groupes";
import "./EventCard.css"

function EventCard({ event }) {

  let startDateRaw = event.startDate
  let date = startDateRaw.slice(0, 10)

  let timeRaw = startDateRaw.slice(11, 16)

  return (
    <div className="OOverDiv">
      <div className="SoManyDiv">
        <NavLink to={`/events/${event.id}`} style={{ textDecoration: "none", color: "brown", }}>
          <div className="WhyOverDiv">
            <div className="CardOverDiv">
              <div className="CimageDiv">
                <img className="Cimage" src={event.previewImage ? event.previewImage : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"} alt="Event Image" />
              </div>
              <div className="iddlybits">
                <div className="EdateAndTime">
                  {date} · {timeRaw}
                </div>
                <div className="Ename">
                  {event.name}
                </div>
                <div className="Elocation">
                  {event.Groupe.city}, {event.Groupe.state}
                </div>
              </div>
            </div>
            <div className="Eblurb">
              {event.description ? <div>{event.description}</div> : <div>ADD DESCRIPTION TO GET ALL EVENTS ENDPOINT IN DATABASE</div>}
            </div>
          </div>
        </NavLink>
      </div>
    </div>
  )
}

export default EventCard;
