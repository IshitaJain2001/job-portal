 import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { myContext } from '../App';
import { useDispatch } from 'react-redux';
 
 export default function TopCompanydata() {
    const {company}= useParams()

    const decodeCompany= decodeURIComponent(company)

    console.log(decodeCompany);
const dispatch= useDispatch()
 const {jobsArray}=    useContext(myContext)

  console.log(jobsArray?.jobs);
  
 const [jobsAvailable, setJobsAvailable]= useState([])
 useEffect(()=>{
if(jobsArray?.jobs?.length>0){
let filteredData= jobsArray?.jobs?.filter((job)=>String(job.company_name).toLowerCase() ==String( decodeCompany).toLowerCase() || job.company_name.toLowerCase().includes(decodeCompany.toLowerCase()) || decodeCompany.toLowerCase().includes(job.company_name.toLowerCase()))
console.log(filteredData);

setJobsAvailable(filteredData)
}
 },[])
 useEffect(()=>{
console.log(jobsAvailable);

 },[jobsAvailable])
   return (
     <div>
{
  jobsAvailable?.length>0?
  jobsAvailable.map((job)=>{
    return(
<div>
<h2>{job.title}</h2>
      <p
  dangerouslySetInnerHTML={{
    __html: job && job?.description
  }}
></p>
<a href={job.url} onClick={()=>dispatch(addJob(job))}>Proceed to apply </a>
      </div>
    )
  }): <p>sorry no jobs available in the company {decodeCompany} at this moment</p>
}
     </div>
   )
 }
 