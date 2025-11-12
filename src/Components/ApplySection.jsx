import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { addJob } from '../toolkit/applicationSlice';
import { useDispatch } from 'react-redux';
import "../Stylesheets/ApplySection.css"
export default function ApplySection() {
  const isLoggedin = JSON.parse(localStorage.getItem("user")) || null
   const {category , id}=  useParams()
let decodedCategory= decodeURIComponent(category )
   console.log(decodedCategory, id);
   let [categoryJobs, setCategoryjobs]= useState([])
let [desiredJob,setDesiredJob]= useState(null)

const navigate= useNavigate()
const dispatch= useDispatch()
   useEffect(()=>{
async function getData(){
  try{
let res= await fetch(`https://remotive.com/api/remote-jobs?category=${decodedCategory}&limit=1000`)
let data = await res.json()
setCategoryjobs(data )}
catch(err){
console.log(err);
}}
getData()
   },[category])

   useEffect(()=>{
let filteredJob= categoryJobs?.jobs?.filter(job=>Number(job.id)=== Number(id))
setDesiredJob(filteredJob)
   },[id, categoryJobs])


  return (
    <div>
      {
        desiredJob != null ?
        <div>
          <h2>{desiredJob[0].title}</h2>
          <h2> {desiredJob[0].company_name}</h2>
        <p
          className="job-description"
  dangerouslySetInnerHTML={{
    __html: desiredJob && desiredJob[0]?.description
  }}

></p>


{
  isLoggedin=== null ?
  

  
  <button onClick={()=>navigate("/register")}> login to proceed </button>  
  :  <button
    onClick={() => {
      dispatch(addJob(desiredJob[0]));
      window.open(desiredJob[0].url, "_blank"); 
    }}
  >
    proceed to apply
  </button>
}

</div>
     : <p>loading.... </p>
      }
    </div>
  )
}
