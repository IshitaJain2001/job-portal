 import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
 import "../Stylesheets/Navbar.css"
 import { FaSearch } from "react-icons/fa";
 import { userSearch } from '../toolkit/SearchSlice';
import ProfileComp from './ProfileComp';
import Overlay from './Overlay';
 export default function Navbar() {
    const [Visible, setVisible]=  useState([false, false ])
     const isLoggedIn=   useSelector(state=> state.login.isLoggedIn)
     const user= useSelector(state=>state.login.user)
     const [isProfileOpen, setIsProfileOpen]= useState(false)
    const dispatch=  useDispatch()
// npm i react-icons 
     let [userSearch,setUserSearch]= useState("")
   return (
    <>
  
     <div className='navbar-container'>
        {
            isProfileOpen? (
            <>
            
            <Overlay/>
            <ProfileComp setIsProfileOpen={setIsProfileOpen}/> </>):null
        }
        <div className="left">
            <button >LOGO</button>
            <button onMouseEnter={()=>{
              setVisible([true, false])
            }}  onMouseLeave={()=>setVisible([false, false])}>Jobs</button>
            <button onMouseEnter={()=>{
              setVisible([ false, true])
            }}  onMouseLeave={()=>setVisible([false, false])}>Companies </button>
        </div>
        <div className="center">
            <input type="text" name="" id="" placeholder='search job here' onChange={e=>setUserSearch(e.target.value)} />
          <button onClick={()=>dispatch(userSearch())}>
            <FaSearch />
            </button>  
        </div>
        <div className="right">
            {
                isLoggedIn?
                <p> Welcome  {user?.name}</p>
                
                : <div className='loginbtns'>
                    <button>register</button>
                    <button>login</button>
                    <button onClick={()=>setIsProfileOpen(true)}>☰</button>
                    </div>
            }
        </div></div>

     <div>
        {
            Visible[0]?
            <div className="jobs-hover">
    <li>Recommended jobs </li>
    <li>invites</li>
    <li>Application Status</li>
    <li>saved jobs </li>
</div>
            : ""
        }

{
    Visible[1]?
    <div className="companies-hover">
    <li>MNC</li>
    <li>Featured Companies </li>
    <li>Startup</li>
    <li>Top Companies </li>
    <li>IT Companies </li>
</div>
    : <p></p>
}

 </div>

       </>
   )
 }
 