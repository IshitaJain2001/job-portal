 import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { removeSave } from '../toolkit/applicationSlice';
 
 export default function Savedjobs() {
   const {savedJobs}=  useSelector(state=>state.applicationHistory)
 const jobs=   JSON.parse(localStorage.getItem("savedJobs"))
   console.log(savedJobs);
  const [savedJobss, setSavedJob]= useState(jobs || savedJobs)
  const dispatch=  useDispatch()
   return (
     <div>
      {
        savedJobss.length>0 ?
savedJobss.map((job,index)=>{
  return (
    <>
        <li>{job.title}</li>
    <button onClick={()=>dispatch(removeSave({index}))}>remove from save </button>
    </>

  )
})
        : <p> no saved jobs yet</p>
      }
     </div>
   )
 }
 