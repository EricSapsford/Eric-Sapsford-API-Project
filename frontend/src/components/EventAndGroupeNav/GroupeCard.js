import React from "react";
// import { useEffect } from "react";
import { NavLink } from "react-router-dom";
// import { useSelector, useDispatch } from "react-redux";
// import * as groupeActions from "../../store/groupes";
import "./GroupCard.css"

function GroupCard({ groupe }) {

  return (
    <div className="OOverDiv">
      <div className="SoManyDiv">
        <NavLink to={`/groups/${groupe.id}`} style={{ textDecoration: "none", color: "brown", }}>
          <div className="WhyOverDiv">
            <div className="CardOverDiv">
              <div className="CimageDiv">
                <img className="Cimage" src={groupe.previewImage ? groupe.previewImage : "https://upload.wikimedia.org/wikipedia/commons/6/65/No-Image-Placeholder.svg"} alt="Group Image" />
              </div>
              <div className="iddlybits">
                <div className="Gname">
                  {groupe.name}
                </div>
                <div className="Glocation">
                  {groupe.city}, {groupe.state}
                </div>
                <div className="Gblurb">
                  <p>
                    {groupe.about}
                  </p>
                </div>
                <div className="GgooksPen">
                  <div className="Ggooks">
                    {groupe.numEvents} {groupe.numEvents === 1 ? "event" : "events"}· {groupe.private ? <span>Private</span> : <span>Public</span>}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </NavLink>
      </div>
    </div >
  )
}

export default GroupCard;
