 import React from 'react'
import { useSelector } from 'react-redux'
 
 export default function Home() {
  const isLoggedIn=   useSelector(state=> state.login.isLoggedIn)
  console.log(isLoggedIn);
  
   return (
     <div></div>
   )
 }
 