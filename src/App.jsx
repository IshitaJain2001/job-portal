import React, { createContext, useEffect, useState } from 'react'
import Navbar from './Components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './Components/Home'
import Settings from './Components/Settings'
import Jobs from './Components/Jobs'
import ApplySection from './Components/ApplySection'
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

<Routes>
  <Route path="/" element={<Home/>}/>
<Route path='/help-centre' element={<Settings/>}/>
<Route path='/jobs/:category' element={<Jobs/>}/>
<Route path='/applyto/:category/:id' element={<ApplySection/>}/>
</Routes>

</myContext.Provider>




    </div>
  )
}
