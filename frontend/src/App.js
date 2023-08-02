import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Switch, Route } from "react-router-dom";
import * as sessionActions from "./store/session";
import { NavLink } from "react-router-dom";


import Navigation from "./components/Navigation";
import EventAndGroupeNav from "./components/EventAndGroupeNav";

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
          <h1>Landing Page</h1>
          <NavLink to="/groups">Groups</NavLink>
        </Route>
        <Route exact path="/groups">
          <EventAndGroupeNav />
        </Route>
        <Route exact path="groups/new">
          <h1>Create a New Groupe</h1>
        </Route>
        <Route exact path="/groups/:groupId">
          <h1>Groupe Details</h1>
        </Route>

      </Switch>}
    </>
  );
}

export default App;
