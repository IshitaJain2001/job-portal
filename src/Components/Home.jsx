 import React, { useContext, useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import { myContext } from '../App';
 import "../Stylesheets/Home.css"
import { Link } from 'react-router-dom';
import { GiPreviousButton } from "react-icons/gi";
import { GiNextButton } from "react-icons/gi";
 export default function Home() {
  const isLoggedIn=   useSelector(state=> state.login.isLoggedIn)

 const {jobsArray}=  useContext(myContext)

 const [jobCategory, setjobcategory ]= useState([])

const [hiringCompanies, setHiringCompanies]= useState([])
const [startIndex, setStartIndex] = useState(0)


function nextSlide(){
if(startIndex+ 10 <hiringCompanies.length){
  setStartIndex(prev=>prev+1)
}
}

function prevSlide(){
if(startIndex>0){
setStartIndex(prev=>prev-1)
}
}
 useEffect(()=>{
  async function getHiringComapnies(){
   let res=  await fetch("/companies.json")
  let data= await res.json()
  console.log(data.top_hiring_companies);
  
  setHiringCompanies(data.top_hiring_companies)
  console.log(hiringCompanies);
  
  }
  getHiringComapnies()
 },[])
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
let [companiesToShow, setCompaniesToShow]= useState([]);

useEffect(()=>{
  if(hiringCompanies.length>0){

  let val= hiringCompanies?.slice(startIndex, startIndex+10)
setCompaniesToShow(val)}

},[hiringCompanies, startIndex])


  // slice  
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

       <div className='carousel'>
<button onClick={prevSlide}><GiPreviousButton /></button>
{
  companiesToShow?.length>0?
  companiesToShow.map((company)=>{
    return(
      <>
   <Link to={`/top-hiring-company/${encodeURIComponent(company)}`}>
<li>{company}</li>
  </Link>   
      </>
    )
  })
  : <>loading </>
}
<button onClick={nextSlide}><GiNextButton /></button>
       </div>
       </div>
   )
 }
 