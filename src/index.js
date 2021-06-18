import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import {Route,BrowserRouter as Router} from 'react-router-dom';
import BugScreen from './screens/bugscreen';
import SignUp  from './screens/signup';
import ProjectScreen from './screens/projectscreen';
import SignIn from "./screens/signin";
const routing=(
<Router>
  <Route exact path="/" component={SignIn}/>
  <Route exact path="/signup" component={SignUp}/>
  <Route exact path="/buglist" component={BugScreen}/>
  <Route exact path="/projectlist" component={ProjectScreen}/>
  </Router>
)




ReactDOM.render(
routing,document.getElementById('root')
);

export default routing


