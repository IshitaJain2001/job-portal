 import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { myContext } from '../App';
 
 export default function TitleJob() {
   const {title}=  useParams()
   const decodedTitle= decodeURIComponent(title)


  const {jobsArray}= useContext(myContext)
const [filteredJobs, setFilteredJobs] = useState([])



useEffect(()=>{
const filteredData= jobsArray?.jobs?.filter((job)=>{
  return job.title== decodedTitle
})
setFilteredJobs(filteredData)
},[jobsArray,decodedTitle])

  return (
     <div>
      {
        filteredJobs?.length>0?
        filteredJobs.map((job)=>{
        return <div>
            <li>{job.title}</li>
            <li>{job.company_name}</li>
            <a href={job.url}>apply here </a>
          </div>
      
        })
        : <p>try again later ... </p>
      }
     </div>
   )
 }
 