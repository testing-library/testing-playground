import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Playground from './Playground';
import Layout from './Layout';
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
          <Layout>
            <DomEvents />
          </Layout>
        </Route>
        <Route path="/">
          <Layout>
            <Playground />
          </Layout>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
