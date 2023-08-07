import { csrfFetch } from "./csrf";


//---------------------------------- CONSTANTS ----------------------------------
//---------------------------------- CONSTANTS ----------------------------------
//---------------------------------- CONSTANTS ----------------------------------
//---------------------------------- CONSTANTS ----------------------------------

const GET_ALL_EVENTS = "events/getAllEvents"
const GET_ONE_EVENT = "events/getOneEvent"
const CREATE_EVENT = "events/createEvent"
const UPDATE_EVENT = "events/updateEvent"
const DELETE_EVENT = "events/deleteEvent"
const CREATE_EVENT_IMAGE = "events/createEventImage"
const UPDATE_EVENT_IMAGE = "events/updateEventImage"


//------------------------------- ACTION CREATORS -------------------------------
//------------------------------- ACTION CREATORS -------------------------------
//------------------------------- ACTION CREATORS -------------------------------
//------------------------------- ACTION CREATORS -------------------------------

const getAllEvents = (events) => {
  return {
    type: GET_ALL_EVENTS,
    events
  }
}

const getOneEvent = (event) => {
  return {
    type: GET_ONE_EVENT,
    event
  }
}

const createEvent = (event) => {
  return {
    type: CREATE_EVENT,
    event
  }
}

const updateEvent = (event) => {
  return {
    type: UPDATE_EVENT,
    event
  }
}

const deleteEvent = () => {
  return {
    type: DELETE_EVENT
  }
}

const createEventImage = (img) => {
  return {
    type: CREATE_EVENT_IMAGE,
    img
  }
}

// const updateEventImage = (img) => {
//   return {
//     type: UPDATE_EVENT_IMAGE,
//     img
//   }
// }

//------------------------------------ THUNKs -----------------------------------
//------------------------------------ THUNKs -----------------------------------
//------------------------------------ THUNKs -----------------------------------
//------------------------------------ THUNKs -----------------------------------

export const getAllEventsThunk = () => async (dispatch) => {
  const res = await csrfFetch("/api/events/", {
    method: "GET",
  });
  if (res.ok) {
    const { Events } = await res.json();
    // dispatch(getAllGroupes(data.Groups))
    // return res;
    // console.log("hello from thunk, events", Events)
    dispatch(getAllEvents(Events)) //reducers SHOULD be running now
    // okay yeah gotta update the combreducer in index.js
    return Events
  } else {
    const errors = await res.json();
    return errors
    // don't you dare run a reducer here you fuck
  }
}

export const getOneEventThunk = (eventId) => async (dispatch) => {
  // console.log("hello from get one event thunk", eventId)
  const res = await csrfFetch(`/api/events/${eventId}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });

  if (res.ok) {
    const detes = await res.json();
    dispatch(getOneEvent(detes));
  } else {
    const errors = await res.json();
    return errors;
  }
}

export const createEventThunk = (myCreatedEvent) => async (dispatch) => {
  const { venueId, name, type, capacity, isPrivate, price, description, startDate, endDate, url, groupId } = myCreatedEvent
  console.log("inside create event thunk, event", myCreatedEvent)
  const res = await csrfFetch(`/api/groups/${groupId}/events`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      venueId,
      name,
      type,
      private: isPrivate,
      capacity,
      price,
      description,
      startDate,
      endDate
    })
  });

  if (res.ok) {
    const data = await res.json();
    console.log("data inside thunk", data)
    // setInterval(() => dispatch(createEvent(data)), 1000)
    dispatch(createEvent(data))

    const eventId = data.id
    const preview = true;
    //===============================
    const imgRes = await csrfFetch(`/api/events/${eventId}/images`, {
      //=============================
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        preview,
      })
    });

    if (imgRes.ok) {
      const img = await imgRes.json();
      const imgSpoof = {
        id: img.id,
        url: img.url,
        preview: img.preview
      }

      console.log("imgSpoof", imgSpoof)

      dispatch(createEventImage(imgSpoof));
    }
    return data;
  } else {
    console.log("thunk create else")
    const errors = await res.json();
    return errors
  }
}

export const deleteEventThunk = (eventId) => async (dispatch) => {
  const res = await csrfFetch(`/api/events/${eventId}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
  });

  if (res.ok) {
    const succ = await res.json();
    dispatch(deleteEvent(eventId));
    return succ
  } else {
    const errors = await res.json();
    return errors;
  }
}

//----------------------------------- REDUCER -----------------------------------
//----------------------------------- REDUCER -----------------------------------
//----------------------------------- REDUCER -----------------------------------
//----------------------------------- REDUCER -----------------------------------

const initialState = {
  allEvents: {},
  singleEvent: {}
}

const eventReducer = (state = initialState, action) => {

  switch (action.type) {

    case GET_ALL_EVENTS: {
      // const newState = { ...state, allEvents: {} }
      const newState = { ...state, allEvents: {} }
      // console.log(action)
      // console.log(state)
      action.events.forEach((eventObj) => {
        newState.allEvents[eventObj.id] = eventObj
      });
      // console.log("newState", newState)
      return newState
    }

    case GET_ONE_EVENT: {
      // const newState = { ...state, singleEvent: {} }
      const newState = { ...state, singleEvent: {} }
      newState.singleEvent = action.event;
      return newState;
    }

    case CREATE_EVENT: {
      // console.log("hello from create event thunk")
      // console.log(action);
      // const newState = { ...state, singleEvent: {}, allEvents: {} }
      const newState = { ...state, singleEvent: {} }
      newState.allEvents[action.event.id] = action.event
      return newState
    }

    case CREATE_EVENT_IMAGE: {
      // console.log("hello from create event image thunk")
      // const newState = { ...state, singleEvent: { EventImages: [] } }
      const newState = { ...state, singleEvent: { EventImages: [] } }
      newState.singleEvent.EventImages.push(action.img)
      return newState;
    }

    case DELETE_EVENT: {
      // const newState = { ...state, allEvents: {} }
      const newState = { ...state }
      delete newState.allEvents[action.eventId]
      return newState;
    }

    default: {
      return state
    }
  }
}

export default eventReducer;
