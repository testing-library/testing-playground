import * as React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { PreviewEventsProvider } from './context/PreviewEvents';
import Loader from './components/Loader';

const Playground = React.lazy(() => import('./pages/Playground'));
const Embedded = React.lazy(() => import('./pages/Embedded'));

function App() {
  return (
    <Router>
      <PreviewEventsProvider>
        <React.Suspense fallback={<Loader />}>
          <Switch>
            <Route path="/embed/:gistId?/:gistVersion?" component={Embedded} />
            <Route
              path={['/gist/:gistId/:gistVersion?', '/']}
              component={Playground}
            />
          </Switch>
        </React.Suspense>
      </PreviewEventsProvider>
    </Router>
  );
}

export default App;
