//----------------------------------- IMPORTS -----------------------------------
//----------------------------------- IMPORTS -----------------------------------
//----------------------------------- IMPORTS -----------------------------------
//----------------------------------- IMPORTS -----------------------------------

import { csrfFetch } from "./csrf";


//---------------------------------- CONSTANTS ----------------------------------
//---------------------------------- CONSTANTS ----------------------------------
//---------------------------------- CONSTANTS ----------------------------------
//---------------------------------- CONSTANTS ----------------------------------

const GET_ALL_GROUPES = "groupes/getAllGroupes"
const GET_ONE_GROUPE = "groupes/getOneGroupe"
const CREATE_GROUPE = "groupes/createGroupe"
const UPDATE_GROUPE = "groupes/updateGroupe"
const DELETE_GROUPE = "groupes/deleteGroupe"
const CREATE_GROUPE_IMAGE = "groupes/createGroupeImage"
const UPDATE_GROUPE_IMAGE = "groupes/updateGroupeImage"


//------------------------------- ACTION CREATORS -------------------------------
//------------------------------- ACTION CREATORS -------------------------------
//------------------------------- ACTION CREATORS -------------------------------
//------------------------------- ACTION CREATORS -------------------------------

const getAllGroupes = (groupes) => {
  return {
    type: GET_ALL_GROUPES,
    groupes
  }
}

const getOneGroupe = (groupe) => {
  return {
    type: GET_ONE_GROUPE,
    groupe
  }
}

const createGroupe = (groupe) => {
  return {
    type: CREATE_GROUPE,
    groupe
  }
}

const updateGroupe = (groupe) => {
  return {
    type: UPDATE_GROUPE,
    groupe
  }
}

const deleteGroupe = () => {
  return {
    type: DELETE_GROUPE
  }
}

const createGroupeImage = (img) => {
  return {
    type: CREATE_GROUPE_IMAGE,
    img
  }
}

const updateGroupeImage = (img) => {
  return {
    type: UPDATE_GROUPE_IMAGE,
    img
  }
}

//------------------------------------ THUNKs -----------------------------------
//------------------------------------ THUNKs -----------------------------------
//------------------------------------ THUNKs -----------------------------------
//------------------------------------ THUNKs -----------------------------------

export const getAllGroupesThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/groups/", {
    method: "GET",
  });
  if (res.ok) {
    const { Groups } = await res.json();
    // dispatch(getAllGroupes(data.Groups))
    // return res;
    // console.log("hello from thunk")
    dispatch(getAllGroupes(Groups)) //reducers SHOULD be running now
    // okay yeah gotta update the combreducer in index.js
    return Groups
  } else {
    const errors = await res.json();
    return errors
    // don't you dare run a reducer here you fuck
  }
}

export const createGroupeThunk = (myCreatedGroupe) => async (dispatch) => {
  const { name, about, type, isPrivate, city, state, url } = myCreatedGroupe
  const res = await csrfFetch("/api/groups/", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      about,
      type,
      private: isPrivate,
      city,
      state
    }),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(createGroupe(data)); //create groupe sans image

    //nested image logic, THANK YOU SHERRY!
    const groupeId = data.id
    const preview = true;
    const imgRes = await csrfFetch(`/api/groups/${groupeId + 1}/images`, {
      // I DON'T KNOW WHY, I DON'T KNOW HOW, BUT IF YOU TAKE ^ THIS OUT, EVERYTHING BREAKS.
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        groupeId,
        url,
        preview
      }),
    });

    if (imgRes.ok) {
      console.log("imgRes ok", imgRes)
      const img = await imgRes.json();
      console.log("img", img)
      const imgSpoof = {
        id: img.id,
        groupeId,
        url: img.url,
        preview: img.preview
      }

      console.log("imgSpoof", imgSpoof)

      dispatch(createGroupeImage(imgSpoof)); //create image for group

    }

    return data; //gimme back my data

  } else {
    const errors = await res.json();
    return errors
  }
}

export const getOneGroupeThunk = (groupeId) => async (dispatch) => {
  const res = await csrfFetch(`/api/groups/${groupeId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (res.ok) {
    const detes = await res.json();
    dispatch(getOneGroupe(detes));
  } else {
    const errors = await res.json();
    return errors;
  }
}

export const deleteGroupeThunk = (groupeId) => async (dispatch) => {
  console.log("hello from deleteGroupeThunk", groupeId);
  const res = await csrfFetch(`/api/groups/${groupeId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (res.ok) {
    const succ = await res.json();
    dispatch(deleteGroupe(groupeId));
    return succ
  } else {
    const errors = await res.json();
    return errors;
  }
}

export const updateGroupeThunk = (myUpdatedGroupe) => async (dispatch) => {
  const { name, about, type, isPrivate, city, state, url, groupeId } = myUpdatedGroupe
  const res = await csrfFetch(`/api/groups/${groupeId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name,
      about,
      type,
      private: isPrivate,
      city,
      state
    }),
  });

  if (res.ok) {
    const data = await res.json();
    dispatch(createGroupe(data)); //create groupe sans image

    //nested image logic, THANK YOU SHERRY!
    const newGroupeId = data.id
    const preview = true;
    const imgRes = await csrfFetch(`/api/groups/${newGroupeId}/images`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        newGroupeId,
        url,
        preview
      }),
    });

    if (imgRes.ok) {
      console.log("imgResUp ok", imgRes)
      const img = await imgRes.json();
      console.log("imgUp", img)
      const imgSpoof = {
        id: img.id,
        newGroupeId,
        url: img.url,
        preview: img.preview
      }

      console.log("imgSpoofUp", imgSpoof)

      dispatch(updateGroupeImage(imgSpoof)); //create image for group

    }

    return data; //gimme back my data

  } else {
    const errors = await res.json();
    return errors
  }
}

//----------------------------------- REDUCER -----------------------------------
//----------------------------------- REDUCER -----------------------------------
//----------------------------------- REDUCER -----------------------------------
//----------------------------------- REDUCER -----------------------------------

const initialState = { // this shape is defined by the store, can change if needed
  allGroups: {},
  singleGroup: {}
}

const groupeReducer = (state = initialState, action) => {
  // console.log("hello from reducer")

  switch (action.type) {

    case GET_ALL_GROUPES: {
      // const newState = { ...state, allGroups: {} }
      const newState = { ...state }
      // console.log(action)
      // console.log(state)
      action.groupes.forEach((groupeObj) => {
        newState.allGroups[groupeObj.id] = groupeObj
      });
      // console.log("newState", newState)
      return newState // <-- this forces render to reload
    }

    case CREATE_GROUPE: {
      console.log("hello from create groupe thunk")
      const newState = { ...state, singleGroup: {} }
      // console.log("action", action)
      // console.log("action group", action.group.id)
      newState.allGroups[action.groupe.id] = action.groupe
      return newState;
    }

    case GET_ONE_GROUPE: {
      const newState = { ...state, singleGroup: {} }
      newState.singleGroup = action.groupe;
      return newState;
    }

    // case UPDATE_GROUPE: {

    // }

    case DELETE_GROUPE: {
      const newState = { ...state, allGroups: { ...state.allGroups }, singleGroup: { ...state.singleGroup } }
      // console.log("hellof from delete reducer, newstate:", newState)
      delete newState.allGroups[action.groupeId]
      return newState;
    }

    case CREATE_GROUPE_IMAGE: {
      // console.log("hello from create image thunk")
      const newState = { ...state, singleGroup: { GroupeImages: [] } }
      // console.log("action", action)
      newState.singleGroup.GroupeImages.push(action.img)
      return newState;
    }

    case UPDATE_GROUPE_IMAGE: {
      const newState = { ...state, singleGroup: { GroupeImages: [] } }
      newState.singleGroup.GroupeImages.push(action.img)
      return newState;
    }

    default: {
      return state
    }
  }
}

export default groupeReducer;
