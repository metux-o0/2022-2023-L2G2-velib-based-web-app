import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Carte from './pages/Map'
import Header from './components/Header'
import Error from './components/Error'
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Router>
      <Header />
      <Switch>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/map">
          <br></br>
          <Carte />
        </Route>
        <Route exact path="/contact">
          <Contact />
        </Route>
        <Route>
          <Error />
        </Route>
      </Switch>
    </Router>
);