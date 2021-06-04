import React from "react";
import {BrowserRouter, Route} from 'react-router-dom';
import Home from './components/Home';

const Main =  () => {
  return(
    <div>
      <BrowserRouter>
        <Route path="/" component={Home}></Route>
      </BrowserRouter>
    </div>
  )
}

export default Main;