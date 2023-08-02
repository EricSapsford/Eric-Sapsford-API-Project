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
    return Groups
  } else {
    const errors = await res.json();
    return errors
    // don't you dare run a reducer here you fuck
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
  let newState;

  switch (action.type) {

    case GET_ALL_GROUPES: {
      newState = { ...state, allGroups: {} }
      // console.log(action)
      // console.log(state)
      action.groupes.forEach((groupeObj) => {
        newState.allGroups[groupeObj.id] = groupeObj
      });
      // console.log("newState", newState)
      return newState // <-- this forces render to reload
    }


    // case GET_ONE_GROUPE:



    // case CREATE_GROUPE:



    // case UPDATE_GROUPE:


    // case DELETE_GROUPE:



    default: {
      return state
    }
  }
}

export default groupeReducer;
