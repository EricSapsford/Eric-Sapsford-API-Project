import { csrfFetch } from "./csrf";

const SET_USER = "session/setUser";
const REMOVE_USER = "session/removeUser";

//------------------------------- ACTION CREATORS -------------------------------
//------------------------------- ACTION CREATORS -------------------------------
//------------------------------- ACTION CREATORS -------------------------------
//------------------------------- ACTION CREATORS -------------------------------

//create two POJO action creators
const setUser = (user) => {
  return {
    type: SET_USER,
    user
  };
};

const removeUser = () => {
  return {
    type: REMOVE_USER,
  };
};

//------------------------------------ THUNKs -----------------------------------
//------------------------------------ THUNKs -----------------------------------
//------------------------------------ THUNKs -----------------------------------
//------------------------------------ THUNKs -----------------------------------

// signup
export const signup = (user) => async (dispatch) => {
  const { username, firstName, lastName, email, password } = user;
  const response = await csrfFetch("/api/users", {
    method: "POST",
    body: JSON.stringify({
      username,
      firstName,
      lastName,
      email,
      password,
    }),
  });
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// login
export const login = (user) => async (dispatch) => {
  const { credential, password } = user;
  const res = await csrfFetch("/api/session", {
    method: "POST",
    body: JSON.stringify({
      credential,
      password,
    }),
  });
  const data = await res.json(); // parse JSON body of res
  dispatch(setUser(data.user));
  return res;
};

// retain session user info across a refresh
export const restoreUser = () => async (dispatch) => {
  const response = await csrfFetch("/api/session");
  const data = await response.json();
  dispatch(setUser(data.user));
  return response;
};

// logout
export const logout = () => async (dispatch) => {
  const response = await csrfFetch('/api/session', {
    method: 'DELETE',
  });
  dispatch(removeUser());
  return response;
};

//----------------------------------- REDUCER -----------------------------------
//----------------------------------- REDUCER -----------------------------------
//----------------------------------- REDUCER -----------------------------------
//----------------------------------- REDUCER -----------------------------------

const initialState = { user: null };

const sessionReducer = (state = initialState, action) => {
  switch (action.type) {

    case SET_USER: {
      const newState = { ...state };
      newState.user = action.user;
      return newState;
    }

    case REMOVE_USER: {
      const newState = { ...state };
      newState.user = null;
      return newState;
    }

    default: {
      return state;
    }
  }
};

export default sessionReducer;
