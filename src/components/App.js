import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Playground from './Playground';
import Embedded from './Embedded';
import { PreviewEventsProvider } from '../context/PreviewEvents';

function App() {
  return (
    <Router>
      <PreviewEventsProvider>
        <Switch>
          <Route path="/embed/:gistId?/:gistVersion?" component={Embedded} />
          <Route
            path={['/gist/:gistId/:gistVersion?', '/']}
            component={Playground}
          />
        </Switch>
      </PreviewEventsProvider>
    </Router>
  );
}

export default App;
