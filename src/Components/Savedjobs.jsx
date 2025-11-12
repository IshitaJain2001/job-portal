 import React from 'react'
import { useSelector } from 'react-redux'
 
 export default function Savedjobs() {
   const {savedjobs}=  useSelector(state=>state.applicationHistory)
   console.log(savedjobs);
   
   return (
     <div>Savedjobs</div>
   )
 }
 