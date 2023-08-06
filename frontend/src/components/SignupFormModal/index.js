import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import * as sessionActions from "../../store/session";
import "./SignupForm.css";

function SignupFormModal() {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});
  const { closeModal } = useModal();
  const [disabled, setDisabled] = useState({})

  useEffect(() => {

    if (!firstName.length) setDisabled(true)
    if (!lastName.length) setDisabled(true)
    if (!email.length) setDisabled(true)
    if (username.length < 4) setDisabled(true)
    if (password.length < 6) setDisabled(true)
    if (confirmPassword !== password) setDisabled(true)

    if (firstName.length && lastName.length && email.length && username.length >= 4 && password.length >= 6 && confirmPassword === password) setDisabled(false)

  })

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmPassword) {
      setErrors({});
      return dispatch(
        sessionActions.signup({
          email,
          username,
          firstName,
          lastName,
          password,
        })
      )
        .then(closeModal)
        .catch(async (res) => {
          const data = await res.json();
          if (data && data.errors) {
            setErrors(data.errors);
          }
        });
    }
    return setErrors({
      confirmPassword: "Confirm Password field must be the same as the Password field"
    });
  };

  return (
    <>
      <h1 className="SFheader">Sign Up</h1>
      <form className="SFform" onSubmit={handleSubmit}>
        <label>
          <input
            className="SFinput"
            size={40}
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Email"
          />
        </label>
        {errors.email && <p>{errors.email}</p>}
        <label>
          <input
            className="SFinput"
            type="text"
            size={40}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            placeholder="Username"
          />
        </label>
        {errors.username && <p>{errors.username}</p>}
        <label>
          <input
            className="SFinput"
            type="text"
            size={40}
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            placeholder="First Name"
          />
        </label>
        {errors.firstName && <p>{errors.firstName}</p>}
        <label>
          <input
            className="SFinput"
            type="text"
            size={40}
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            placeholder="Last Name"
          />
        </label>
        {errors.lastName && <p>{errors.lastName}</p>}
        <label>
          <input
            className="SFinput"
            type="password"
            size={40}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Password"
          />
        </label>
        {errors.password && <p>{errors.password}</p>}
        <label>
          <input
            className="SFinput"
            type="password"
            size={40}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm Password"
          />
        </label>
        {errors.confirmPassword && (
          <p>{errors.confirmPassword}</p>
        )}
        <button className="SFbutton" id="SFMbutton" type="submit" disabled={disabled}>Sign Up</button>
      </form>
    </>
  );
}

export default SignupFormModal;
