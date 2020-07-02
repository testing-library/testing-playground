import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Playground from './Playground';
import Embedded from './Embedded';
import DomEvents from './DomEvents';
import Login from './Login';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/embed">
          <Embedded />
        </Route>
        <Route path="/events">
          <DomEvents />
        </Route>
        <Route path="/">
          <Playground />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
