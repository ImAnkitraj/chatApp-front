import {BrowserRouter as Router, Route} from 'react-router-dom'
import React from 'react';
import Join from './components/Join/Join';
import Home from './components/Home/Home';

function App() {
  return (
    <Router>
      <Route path='/' exact component={Join}/>
      <Route path='/home' exact component={Home}/>
    </Router>
  );
}

export default App;
