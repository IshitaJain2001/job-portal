 import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { myContext } from '../App';
 import "../Stylesheets/Home.css"
import { Link } from 'react-router-dom';
 export default function Home() {
  const isLoggedIn=   useSelector(state=> state.login.isLoggedIn)

 const {jobsArray}=  useContext(myContext)

 const [jobCategory, setjobcategory ]= useState([])



useEffect(() => {
  if (jobsArray.length !== 0) {
    const categoryMap = {};
console.log(jobsArray.jobs);

    jobsArray.jobs.forEach((job) => {
      if (categoryMap[job.category]) {
        categoryMap[job.category]++;
      } else {
        categoryMap[job.category] = 1;
      }
    });

    const updatedCategories = Object.entries(categoryMap).map(([category, count]) => ({
      category,
      numofjobs: count,
    }));

    setjobcategory(updatedCategories);
  }
}, [jobsArray]);

   return (
     <div className='cards-container'>
      <div className="cards">
{
  jobCategory.length>0 ?
  jobCategory.map((job, index)=>{return(

    <Link to={`/jobs/${encodeURIComponent(job.category)}`}>
      <div className="card">

    <h2>{job.category} </h2>  
    <p>Around {job.numofjobs} jobs</p>

    </div>
    
    </Link>

    )
  
  })
  
  : <p> loading....</p>
}
      </div>
       </div>
   )
 }
 