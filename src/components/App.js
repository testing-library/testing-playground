import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Playground from './Playground';
import Embedded from './Embedded';
import DomEvents from './DomEvents';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/embed" component={Embedded} />
        <Route path="/events" component={DomEvents} />
        <Route
          path={['/gist/:gistId/:gistVersion?', '/']}
          component={Playground}
        />
      </Switch>
    </Router>
  );
}

export default App;
