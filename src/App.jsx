import React, { createContext, useEffect, useState } from 'react'
import Navbar from './Components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './Components/Home'
import Settings from './Components/Settings'
const myContext= createContext()
export default function App() {
const [jobs,setJobs]=  useState([])
 useEffect(()=>{
    async function gettingJobs(){
 fetch('https://remotive.com/api/remote-jobs?category=software-dev&limit=50')
  .then(res => res.json())
  .then(data => {
   setJobs(data)
   console.log(data);
   })
  .catch(err => console.error(err));
}
gettingJobs()
  },[])
  return (
    <div>
<Navbar/>
<myContext.Provider value={{jobs}}>
<Home/>

</myContext.Provider>

<Routes>
<Route path='/help-centre' element={<Settings/>}/>

</Routes>



    </div>
  )
}
