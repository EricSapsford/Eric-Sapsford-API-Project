import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import { NavLink } from "react-router-dom";


import Navigation from "./components/Navigation";
import EventAndGroupeNav from "./components/EventAndGroupeNav";
import GroupeCreate from "./components/GroupeCreate";
import GroupDetails from "./components/GroupDetails";
import GroupeUpdate from "./components/GroupeUpdate";
import EventSideNav from "./components/EventAndGroupeNav/indexEvNav";
import EventDetails from "./components/EventDetails";
import EventCreate from "./components/EventCreate";
import LandingPage from "./components/LandingPage";

function App() {
  const dispatch = useDispatch();
  const [isLoaded, setIsLoaded] = useState(false);
  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true));
  }, [dispatch]);

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Switch>
        <Route exact path="/">
          <LandingPage />
        </Route>
        <Route exact path="/groups">
          <EventAndGroupeNav />
        </Route>
        <Route exact path="/groups/new">
          <GroupeCreate />
        </Route>
        <Route exact path="/groups/:groupId">
          <GroupDetails />
        </Route>
        <Route path="/groups/:groupId/edit">
          <GroupeUpdate />
        </Route>
        <Route exact path="/events">
          <EventSideNav />
        </Route>
        <Route path="/events/:eventId">
          <EventDetails />
        </Route>
        <Route path="/groups/:groupId/events/new">
          <EventCreate />
        </Route>

      </Switch>}
    </>
  );
}

export default App;
