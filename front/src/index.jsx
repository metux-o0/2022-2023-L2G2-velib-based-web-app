import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'
import Home from './pages/Home'
import Contact from './pages/Contact'
import Carte from './pages/Map'
import Header from './components/Header'
import Error from './components/Error'
import Inscription from './pages/Inscription'
import Connection from './pages/Connection'
import Adresse from './pages/Adresse'
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
        <Route exact path='/inscription'>
          <Inscription />
        </Route>
        <Route exact path='/connection'>
          <Connection />
        </Route>
        <Route exact path='/adresse'>
          <Adresse/>
        </Route>
        <Route>
          <Error />
        </Route>
      </Switch>
    </Router>
);