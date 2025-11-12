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
return {
    ...state,
    savedJobs: [...state.savedJobs, action.payload.newJob]
}
}

}
 })

  export const {addJob}= jobsHistory.actions;
  export default jobsHistory.reducer;


