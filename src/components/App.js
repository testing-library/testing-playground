import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Playground from './Playground';
import Layout from './Layout';
import Embedded from './Embedded';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <Router>
      <Switch>
        <Route path="/embed/">
          <Embedded />
        </Route>
        <Route path="/">
          <Layout>
            <Playground />
            <ToastContainer />
          </Layout>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
