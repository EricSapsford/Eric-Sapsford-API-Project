import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from 'react-redux';
import { useHistory } from "react-router-dom";
import * as sessionActions from '../../store/session';
import "./ProfileButton.css"

function ProfileButton({ user }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const [showMenu, setShowMenu] = useState(false);
  const ulRef = useRef();

  const openMenu = () => {
    if (showMenu) return;
    setShowMenu(true);
  };

  useEffect(() => {
    if (!showMenu) return;

    const closeMenu = (e) => {
      if (!ulRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('click', closeMenu);

    return () => document.removeEventListener("click", closeMenu);
  }, [showMenu]);

  const closeMenu = () => setShowMenu(false);

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push("/")
  };

  const allGroups = (e) => {
    e.preventDefault();
    closeMenu();
    history.push(`/groups`);
  };

  const allEvents = (e) => {
    e.preventDefault();
    closeMenu();
    history.push(`/events`);
  };

  const ulClassName = "profile-dropdown" + (showMenu ? "" : " hidden");

  return (
    <>
      <div>
        <button onClick={openMenu} className="profileButton">
          <i class="fa-solid fa-bell-concierge fa-2xl"></i>
        </button>
      </div>
      <div id="dropdownDiv" className={ulClassName}>
        <div className={ulClassName} ref={ulRef}>
          <dvi className="riggle">Hello {user.firstName}!</dvi>
          <div className="riggle">{user.username}</div>
          {/* <div className="riggle">{user.firstName} {user.lastName}</div> */}
          <div className="riggle">{user.email}</div>
          <div className="riggle">
            <button onClick={logout} className="riggleButton">Log Out</button>
          </div>
          <div className="riggle">

            <button onClick={allGroups} className="riggleButton">View Groups</button>
          </div>
          <div className="riggle">
            <button onClick={allEvents} className="riggleButton">View Events</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileButton;
