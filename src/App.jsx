import React, { createContext, useEffect, useState } from 'react'
import Navbar from './Components/Navbar'
import { Route, Routes } from 'react-router-dom'
import Home from './Components/Home'
import Settings from './Components/Settings'
import Jobs from './Components/Jobs'
import ApplySection from './Components/ApplySection'
import TopCompanydata from './Components/TopCompanydata'
import Register from './Components/Register'
import TitleJob from './Components/TitleJob'
import Savedjobs from './Components/Savedjobs'
export const myContext= createContext()

export default function App() {
const [jobsArray,setJobs]=  useState([])
 useEffect(()=>{
    async function gettingJobs(){
 fetch('https://remotive.com/api/remote-jobs?category=all&limit=200')
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
<Route path='/top-hiring-company/:company' element={<TopCompanydata/>}/>
<Route path='/register' element={<Register/>}/>
<Route path='/search/:title'element={<TitleJob/>} />
<Route path='/savedjobs' element={<Savedjobs/>}/>
</Routes>

</myContext.Provider>




    </div>
  )
}
