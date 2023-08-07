import React from "react";
import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import "./LandingPage.css"
import OpenModalButton from "../OpenModalButton";
import SignupFormModal from "../SignupFormModal";

function LandingPage() {

  const sessionUser = useSelector(state => state.session.user ? state.session.user : "");

  const sessionTruthy = sessionUser ? true : false
  console.log(sessionTruthy)


  return (
    <>
      <div className="banner">
        <div className="bannerRuler">
          <div className="bannerWords">
            <div className="banWordsTop">MeetSup</div>
            <div className="banWords">Where food lives ...</div>
            <div className="banWordsBot">so people can find it</div>
          </div>
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

        {sessionTruthy ?
          <NavLink to="/groups/new" style={{ textDecoration: "none" }}>
            <div className="featureCreate">
              <div className="LPicons"><i class="fa-solid fa-plus fa-2xl"></i></div>
              <div>
                <div className="LPwords" id="CaG">
                  Create a Group
                </div>
              </div>
            </div>
          </NavLink>
          :
          <div style={{ textDecoration: "none" }}>
            <div className="featureCreateDisabled">
              <div className="LPicons"><i class="fa-solid fa-plus fa-2xl"></i></div>
              <div>
                <div className="LPwords" id="CaG">Create a Group</div>
              </div>
            </div>
          </div>
        }

      </div >

      {sessionTruthy ?
        null
        :
        <div className="joinUpButtonDiv">
          <div className="sessionLinksUnderDiv">
            <OpenModalButton
              buttonText="Join MeetSup!"
              modalComponent={<SignupFormModal />}
            />
          </div>
        </div>
      }

    </>
  )

}

export default LandingPage
