import React, { useState } from "react";
import * as groupeActions from "../../store/groupes"
import { useDispatch } from "react-redux";
import { useModal } from "../../context/Modal";
import { useParams, useHistory } from "react-router-dom";
import "./DeleteGroupeModal.css"

function DeleteGroupeModal({ groupId }) {
  const dispatch = useDispatch();
  const history = useHistory();
  // const { groupId } = useParams();
  const { closeModal } = useModal();
  const [errors, setErrors] = useState({});

  // const goBack = (e) => {
  //   e.preventDefault();
  //   (() => {
  //     history.push(`/groups/${groupId}`)
  //   })
  //     .then(closeModal);
  // }

  const deleteIt = (e) => {
    e.preventDefault();
    setErrors({});
    return dispatch(groupeActions.deleteGroupeThunk(groupId))
      .then(closeModal)
      .then(() => {
        history.push("/groups")
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
        <h1 className="DMheader">Confirm Delete</h1>
        <div className="DMmessage">Are you sure you want to remove this group?</div>
        <button
          className="redButton"
          onClick={deleteIt}
        >
          Yes (Delete Group)
        </button>
        <button
          className="greyButton"
          onClick={closeModal}
        >
          No (Keep Group)
        </button>
      </div>
    </>
  )
}

export default DeleteGroupeModal
