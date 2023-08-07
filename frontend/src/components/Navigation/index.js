import React from "react";
import { NavLink, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import OpenModalButton from "../OpenModalButton";
import LoginFormModal from "../LoginFormModal";
import SignupFormModal from "../SignupFormModal";
import * as sessionActions from "../../store/session"
import "./Navigation.css";
import LoginFormDemo from "../LoginFormDemoModal";

function Navigation({ isLoaded }) {
  const sessionUser = useSelector((state) => state.session.user);
  const history = useHistory();

  const create = (e) => {
    e.preventDefault();
    history.push("/groups/new")
  }


  let sessionLinks;
  if (sessionUser) {
    sessionLinks = (
      <div className="sessionLinks">
        <div className="sessionLinksUnderDiv">
          <button className="startNewGroupButton" onClick={create}>Start a new group</button>
        </div>
        <div className="sessionLinksUnderDiv">
          <ProfileButton user={sessionUser} />
        </div>
      </div>
    );
  } else {
    sessionLinks = (
      <div className="sessionLinks">
        <div className="sessionLinksUnderDiv">
          <OpenModalButton
            buttonText="Log In"
            modalComponent={<LoginFormModal />}
          />
        </div>
        <div className="sessionLinksUnderDiv">
          <OpenModalButton
            buttonText="Sign Up"
            modalComponent={<SignupFormModal />}
          />
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="navigationHead">
        <div className="navigationAnother">
          <NavLink exact to="/" style={{ textDecoration: "none", color: "darkred", fontWeight: "bolder" }}>
            <div className="meetSup">
              <div className="meetSupIcon">
                <i class="fa-solid fa-utensils fa-2xl" style={{ color: "darkred" }}></i>
              </div>
              <div className="meetSupWord">
                MeetSup
              </div>
            </div>
          </NavLink>
        </div>
        <div className="navigationLinksDiv">
          {isLoaded && sessionLinks}
        </div>
      </div>
    </>
  );
}

export default Navigation;
