 import React, { useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { myContext } from '../App';
 
 export default function TopCompanydata() {
    const {company}= useParams()

    const decodeCompany= decodeURIComponent(company)

    console.log(decodeCompany);
   const [jobsData, setJobsData]= useState([])
 const data=    useContext(myContext)
setJobsData(data.jobsArray)
  
 const [jobsAvailable, setJobsAvailable]= useState([])
 useEffect(()=>{
if(jobsData.length>0){
let filteredData= jobsData.filter((job)=>job.company_name== decodeCompany)
console.log(filteredData);

setJobsAvailable(filteredData)
}
 },[])
   return (
     <div>TopCompanydata</div>
   )
 }
 