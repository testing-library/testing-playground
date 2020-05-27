import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { AppContextProvider } from './Context';
import Playground from './Playground';
import Layout from './Layout';

function App() {
  return (
    <AppContextProvider>
      <Router>
        <Switch>
          <Route path="/">
            <Layout>
              <Playground />
            </Layout>
          </Route>
        </Switch>
      </Router>
    </AppContextProvider>
  );
}

export default App;
