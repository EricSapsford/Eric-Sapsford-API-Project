import React, { useState } from "react";
import * as sessionsActions from "../../store/session"
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useParams, useHistory } from "react-router-dom";
import "./LoginFormDemo.css"

function LoginFormDemo() {
  const dispatch = useDispatch();
  const history = useHistory();

  const { closeModal } = useModal();
  const [errors, setErrors] = useState({});

  const credential = "Demo-lition"
  const password = "password"

  const login = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionsActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  }

  return (
    <>
      <h1>Log in as Demo User?</h1>
      <div>
        <button
          className="redButton"
          onClick={login}
        >
          Yes Please!
        </button>
        <button
          className="greyButton"
          onClick={closeModal}
        >
          No Thank You!
        </button>
      </div>
    </>
  )
}

export default LoginFormDemo
