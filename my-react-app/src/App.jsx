import { useState } from 'react'
import {Routes,Route} from "react-router-dom";
import Startpage from "./pages/startpage"
import Homepage from './pages/homepage';
import PlayerDetails from './pages/playerdetails';


function App() {
 

  return (
   <Routes>
    <Route path="/" element={<Startpage/>}/>

     <Route path="/homepage" element={<Homepage/>}/>
      
        {/* Route for player details, using :playerName as a URL parameter */}
     <Route path="/playerdetails/:playerName" element={<PlayerDetails />} />
      
   </Routes>

   
  )
}

export default App;
