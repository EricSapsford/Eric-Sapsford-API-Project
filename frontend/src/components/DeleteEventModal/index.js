import React, { useState } from "react";
import * as eventActions from "../../store/events"
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useParams, useHistory } from "react-router-dom";
import "./DeleteEventModal.css"

function DeleteEventModal({ eventId }) {
  const dispatch = useDispatch();
  const history = useHistory();

  const { closeModal } = useModal();
  const [errors, setErrors] = useState({});

  const deleteIt = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(eventActions.deleteEventThunk(eventId))
      .then(closeModal)
      .then(() => {
        history.push("/events")
      })
      .catch(async (res) => {
        const data = await res.json()
        if (data && data.errors) {
          setErrors(data.errors);
          console.log("you got errors son", data)
        }
      });
  };

  return (
    <>
      <div className="modalDiv">
        <h1>Confirm Delete</h1>
        <div>Are you sure you want to remove this event?</div>
        <button
          className="redButton"
          onClick={deleteIt}
        >
          Yes (Delete Event)
        </button>
        <button
          className="greyButton"
          onClick={closeModal}
        >
          No (Keep Event)
        </button>
      </div>
    </>
  )
}

export default DeleteEventModal
