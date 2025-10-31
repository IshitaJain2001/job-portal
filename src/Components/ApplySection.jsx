import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { addJob } from '../toolkit/applicationSlice';
import { useDispatch } from 'react-redux';

export default function ApplySection() {
   const {category , id}=  useParams()
let decodedCategory= decodeURIComponent(category )
   console.log(decodedCategory, id);
   let [categoryJobs, setCategoryjobs]= useState([])
let [desiredJob,setDesiredJob]= useState(null)
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
  dangerouslySetInnerHTML={{
    __html: desiredJob && desiredJob[0]?.description
  }}
></p>
<a href={desiredJob[0].url} onClick={()=>dispatch(addJob(desiredJob[0]))}>
proceed to apply 
</a>
</div>
     : <p> Job may not be available </p>
      }
    </div>
  )
}
