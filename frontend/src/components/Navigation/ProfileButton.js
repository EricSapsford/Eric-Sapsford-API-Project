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

  const logout = (e) => {
    e.preventDefault();
    dispatch(sessionActions.logout());
    history.push("/")
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
          <div className="riggle">{user.username}</div>
          <div className="riggle">{user.firstName} {user.lastName}</div>
          <div className="riggle">{user.email}</div>
          <div className="riggle">
            <button onClick={logout} className="riggleButton">Log Out</button>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProfileButton;
