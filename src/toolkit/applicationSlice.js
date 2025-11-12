import { createSlice } from "@reduxjs/toolkit";

 let jobsHistory= createSlice({
    name: "applicationHistory",
    initialState: {
        jobs:[],
        savedJobs:[]
    },
    reducers: {
 addJob: (state,action)=>{
    localStorage.setItem("appHistory", JSON.stringify(state))
    return {
        // initiualstate 
...state,
jobs: [...state.jobs,action.payload]
    }},
addSave: (state,action)=>{
    let newSavedJob= [...state.savedJobs, action.payload.newJob]
    localStorage.setItem("savedJobs", JSON.stringify(newSavedJob))
return {
    ...state,
    savedJobs: newSavedJob
}

},
removeSave : (state, action )=>{
 const filteredObj= savedJobs.filter((job, index)=>index != action.payload.index)
 localStorage.setItem("savedJobs", filteredObj)
  return {
    ...state,
    savedJobs: filteredObj
  }

}

}
 })

  export const {addJob,addSave, removeSave}= jobsHistory.actions;
  export default jobsHistory.reducer;


