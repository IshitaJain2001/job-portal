 import React, { useState } from 'react'
import { useSelector } from 'react-redux'
 
 export default function ApplicationHistory() {
 const {jobs}=   useSelector(state=>state?.applicationHistory)
 const appHistory= JSON.parse(localStorage.getItem("appHistory"))
 const [history, setHistory]= useState( appHistory|| jobs||[])
console.log(history);

   return (
     <div>ApplicationHistory</div>
   )
 }
 
 