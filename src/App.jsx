import React, { createContext, useEffect, useState } from 'react'
import Navbar from './Components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './Components/Home'
import Settings from './Components/Settings'
export const myContext= createContext()

export default function App() {
const [jobsArray,setJobs]=  useState([])
 useEffect(()=>{
    async function gettingJobs(){
 fetch('https://remotive.com/api/remote-jobs?category=all&limit=1000')
  .then(res => res.json())
  .then(data => {
   setJobs(data)

   })
  .catch(err => console.error(err));
}
gettingJobs()
  },[])
  return (
    <div>

<myContext.Provider value={{jobsArray}}>
  <Navbar/>
<Home/>

</myContext.Provider>

<Routes>
<Route path='/help-centre' element={<Settings/>}/>

</Routes>



    </div>
  )
}
