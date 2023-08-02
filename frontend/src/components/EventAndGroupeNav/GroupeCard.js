import React from "react";
// import { useEffect } from "react";
import { NavLink } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import * as groupeActions from "../../store/groupes";

function GroupCard({ groupe }) {

  return (
    <NavLink to={`/groups/${groupe.id}`}>
      <div>
        <div className="image">
          <img src={groupe.previewImage ? groupe.previewImage : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"} alt="Group Image" />
        </div>
        <div className="iddlybits">
          <div className="name">
            {groupe.name}
          </div>
          <div className="location">
            {groupe.city}, {groupe.state}
          </div>
          <div className="blurb">
            {groupe.about}
          </div>
          <div className="gooks">
            //PUT NUMBER OF EVENTS IN BACKEND// ~ {groupe.private ? <span>Private</span> : <span>Public</span>}
          </div>
        </div>
      </div>
    </NavLink>
  )
}

export default GroupCard;
