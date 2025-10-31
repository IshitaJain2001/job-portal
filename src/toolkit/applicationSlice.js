import { createSlice } from "@reduxjs/toolkit";

 let jobsHistory= createSlice({
    name: "applicationHistory",
    initialState: {
        jobs:[]
    },
    reducers: {
 addJob: (state,action)=>{
    localStorage.setItem("appHistory", JSON.stringify(state))
    return {
        // initiualstate 
...state,
jobs: [...state.jobs,action.payload]
    }}}
 })

  export const {addJob}= jobsHistory.actions;
  export default jobsHistory.reducer;


