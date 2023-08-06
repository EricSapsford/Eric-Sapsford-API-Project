import React, { useState, useEffect } from "react";
import * as sessionActions from "../../store/session";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import "./LoginForm.css";
// import LoginFormDemo from "../LoginFormDemoModal";

function LoginFormModal() {
  const dispatch = useDispatch();
  const [credential, setCredential] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [disabled, setDisabled] = useState({})

  useEffect(() => {


    if (credential.length < 4) setDisabled(true)
    if (password.length < 6) setDisabled(true)

    if (credential.length >= 4 && password.length >= 6) setDisabled(false)

  })

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(sessionActions.login({ credential, password }))
      .then(closeModal)
      .catch(async (res) => {
        const data = await res.json();
        if (data && data.errors) {
          setErrors(data.errors);
        }
      });
  };

  const login = (e) => {
    e.preventDefault();
    setErrors({});
    let credential = "Demo-lition"
    let password = "password"
    return dispatch(sessionActions.login({ credential, password }))
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
      <div className="LMformDiv">
        <h1 className="LMheader">Log In</h1>
        <form className="LMfomr" onSubmit={handleSubmit}>
          {errors.credential && (
            <p className="eros">{errors.credential}</p>
          )}
          <label>
            <input
              className="LMinput"
              type="text"
              size={40}
              value={credential}
              onChange={(e) => setCredential(e.target.value)}
              required
              placeholder="Username or Email"
            />
          </label>
          <label>
            <input
              className="LMinput"
              type="password"
              size={40}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Password"
            />
          </label>
          <button className="LMbutton" id="loginButtonModal" type=" submit" disabled={disabled}>Log In</button>
          {/* <OpenModalButton
          buttonText="Log in as Demo User"
          modalComponent={<LoginFormDemo />}
        /> */}
          <p className="demoP">
            <button
              className="LMbutton"
              id="demoUser"
              onClick={login}
            >
              Demo User
            </button>
          </p>
        </form>
      </div >
    </>
  );
}

export default LoginFormModal;
