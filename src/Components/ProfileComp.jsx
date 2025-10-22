  import React from 'react'
  import "../Stylesheets/ProfileComp.css"
  import { RxCross1 } from "react-icons/rx";
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
  export default function ProfileComp({setIsProfileOpen}) {
         const isLoggedIn=   useSelector(state=> state.login.isLoggedIn)
     const user= useSelector(state=>state.login.user)
    return (
      <div className='profile-container'>
        {
            isLoggedIn? <>
             <h2> dice academy </h2>
   <p> full stack developer </p>
            </> : <button> pls login to proceed </button>
        }
         <button onClick={()=>setIsProfileOpen(false)}>
             <RxCross1 />
            </button>
     
        <button>view & update profile </button>
      <Link to="/help-centre">
      <button onClick={()=>setIsProfileOpen(false)}>help centre</button>
      </Link>  
        <button className={isLoggedIn? "logout" : "disabledlogout"} >logout</button>
      </div>
    )
  }
  
