 import React, { useContext, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
 import "../Stylesheets/Navbar.css"
 import { FaSearch } from "react-icons/fa";
 import { userSearch } from '../toolkit/SearchSlice';
import ProfileComp from './ProfileComp';
import Overlay from './Overlay';
import { Link } from 'react-router-dom';
import { myContext } from '../App';
 export default function Navbar() {
    const [Visible, setVisible]=  useState([false, false ])
    const [showSuggestions, setShowSuggestions]= useState(false )
     const [isProfileOpen, setIsProfileOpen]= useState(false)
     let [userSearch,setUserSearch]= useState("")
const {jobsArray} = useContext(myContext)

const [filteredData, setFilteredData]= useState([])
useEffect(()=>{
  if(userSearch.trim()=="") {setShowSuggestions(false)
    return;
  }

let filteredArray= jobsArray.jobs?.filter((job)=>{const title= job.title.toLowerCase().includes(userSearch.toLowerCase())
const company = job.company_name.toLowerCase().includes(userSearch.toLowerCase())
return title || company
})
.filter((job, index , arr)=>{
// arr - findIndex (first index )
return index=== arr.findIndex((filteredJob)=> filteredJob.title=== job.title)
})

let array= filteredArray.slice(0,10)
setFilteredData(array)

},[userSearch])
    const dispatch=  useDispatch()
    let userLoggedIn=  JSON.parse(localStorage.getItem("user")) || null
// npm i react-icons 
     
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
            <input type="text" name="" id="" placeholder='search job here' onChange={e=>{setUserSearch(e.target.value)
            setShowSuggestions(true)}
          } />
          <button >
            <FaSearch />
            </button>  
        </div>
<ul>

        {
          showSuggestions && (filteredData.length>0?
          filteredData.map((job)=> <Link to={`/search/${encodeURIComponent(job.title)}`}> <li onClick={()=>setShowSuggestions(false)}>{job.title}</li> </Link>
          )
          : <p>no search found</p>)
        }
        </ul>
        <div className="right">
            {
                userLoggedIn?
                <p> Welcome  {userLoggedIn?.displayName}</p>
                
                : <div className='loginbtns'>
                  <Link to="/register">
                   <button>register</button>
                  </Link> 
                  
               
                    </div>
            }
                 <button onClick={()=>setIsProfileOpen(true)}>☰</button>
        </div></div>

     <div>
        {
            Visible[0]?
            <div className="jobs-hover">
    <li>Recommended jobs </li>
    <li>invites</li>
    <li>Application Status</li>
 <Link to="/savedjobs"> <li>saved jobs </li>   </Link>  
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
 