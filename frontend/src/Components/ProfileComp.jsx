  import React from 'react'
  import "../Stylesheets/ProfileComp.css"
  import { RxCross1 } from "react-icons/rx";
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { removeUser } from '../toolkit/LoginSlice';
  export default function ProfileComp({setIsProfileOpen}) {
const dispatch= useDispatch()
          const userLoggedIn= JSON.parse(localStorage.getItem("user"))|| null
     const user= useSelector(state=>state.login.user)
    return (
      <div className='profile-container'>
        {
            userLoggedIn? <>
             <h2> {userLoggedIn.displayName} </h2>
   <p> full stack developer </p>
   <button>application history</button>
            </> : <button> pls login to proceed </button>
        }
         <button onClick={()=>setIsProfileOpen(false)}>
             <RxCross1 />
            </button>
     
        <button>view & update profile </button>
      <Link to="/help-centre">
      <button onClick={()=>setIsProfileOpen(false)}>help centre</button>
      </Link>  
        <button className={userLoggedIn? "logout" : "disabledlogout"} onClick={async ()=>{
          await signOut(auth)
          localStorage.removeItem("user")
          dispatch(removeUser())
          setIsProfileOpen(false)
        }}>logout</button>
      </div>
    )
  }
  
