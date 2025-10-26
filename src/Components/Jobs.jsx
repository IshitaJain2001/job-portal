import React, { useContext, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { myContext } from '../App';

export default function Jobs() {
    const {category} = useParams()
    console.log(category);

    const decodedCategory= decodeURIComponent(category)
    const {jobsArray}= useContext(myContext)
   const [filteredJobs, setFilteredJobs] = useState([])
  useEffect(()=>{
     
const filteredArray= jobsArray?.jobs?.filter((job)=>job.category=== decodedCategory)
setFilteredJobs(filteredArray)
  },[category])

  return (
    <div>
{
    filteredJobs?.length>0 ?
    
    filteredJobs?.map((job)=>{
         const publishedDate = new Date(job.publication_date);
  const now = new Date();
  const diffMs = now - publishedDate;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
        return(
            <Link to={`/applyto/${encodeURI(job.category)}/${job.id}`}>
            <div>
<h3>{job.title}</h3> 
<span>{job.company_name}</span>
<p>{`${job.tags.join(" , ")}`}</p>
{job.salary == "" ?<p>

not disclosed
</p>: <p>
    {job.salary}
</p> }
{
     <p>Posted {diffDays} days ago</p>
}
<button>hide</button>
 <button>like</button>
    </div>
            
            
            </Link>

        )

    })
    : <p> try again later...</p>
}
    </div>
  )
}
