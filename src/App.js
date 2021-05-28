import {BrowserRouter as Router, Redirect, Route} from 'react-router-dom'
import React from 'react';
import Join from './components/Join/Join';
import Home from './components/Home/Home';

function App() {
  return (
    <Router>
      <Route path='/' exact component={Join}/>
      {
        localStorage.getItem('userId') ? <Route path ='/home' exact component={Home}/> : <Redirect to='/' exact/>
      }
    </Router>
  );
}

export default App;
