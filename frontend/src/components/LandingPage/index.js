import React from "react";
import { NavLink } from "react-router-dom";
import "./LandingPage.css"

function LandingPage() {

  return (
    <>
      <div className="banner">
        <div className="bannerWords">
          <div className="banWordsTop">MeetSup</div>
          <div className="banWords">Where food lives ...</div>
          <div className="banWordsBot">so people can find it</div>
        </div>
      </div>

      <div className="featureLinks">
        <NavLink to="/events" style={{ textDecoration: "none" }}>
          <div className="featureEvents">
            <div className="LPicons"><i class="fa-solid fa-calendar-days fa-2xl"></i></div>
            <div>
              <div className="LPwords">Events</div>
            </div>
          </div>
        </NavLink>
        <NavLink to="/groups" style={{ textDecoration: "none" }}>
          <div className="featureGroups">
            <div className="LPicons"><i class="fa-solid fa-people-line fa-2xl"></i></div>
            <div>
              <div className="LPwords">Groups</div>
            </div>
          </div>
        </NavLink>
        <NavLink to="/groups/new" style={{ textDecoration: "none" }}>
          <div className="featureCreate">
            <div className="LPicons"><i class="fa-solid fa-plus fa-2xl"></i></div>
            <div>
              <div className="LPwords" id="CaG">Create a Group</div>
            </div>
          </div>
        </NavLink>
      </div >
    </>
  )

}

export default LandingPage
