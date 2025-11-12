 import React, { useEffect, useState } from 'react'
import { auth, provider } from '../firebase'
import { signInWithPopup, signOut } from 'firebase/auth'
import { useDispatch, useSelector } from 'react-redux'
import { addUser } from '../toolkit/LoginSlice'

 export default function Register() {


// const userDetails= useSelector(state=>state.login.isLoggedIn)
// console.log(userDetails);

   const [signedUpUser, setsignedUpUser]= useState( JSON.parse(localStorage.getItem("user")) || null)

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setsignedUpUser(storedUser);
  }, []);

   
 async function handleSignUp(){
let res= await signInWithPopup(auth, provider)
const user= res.user;
console.log(user);

setsignedUpUser(user)
localStorage.setItem("user", JSON.stringify(user))

}
 async function handleSignOut(){
// 3 
 await signOut(auth)
localStorage.removeItem("user")
setsignedUpUser(null)

 }
   return (
     <div>
        {
            signedUpUser !== null ?
            <>
            <h1>welcome , {signedUpUser.displayName}</h1>
            <button onClick={()=>handleSignOut()}>signOut</button>
            </>

            :
            <button onClick={()=>handleSignUp()}> sign up with google </button>
        }
        
     </div>
   )
 }
 