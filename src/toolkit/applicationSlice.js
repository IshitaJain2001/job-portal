import { createSlice } from "@reduxjs/toolkit";

 let jobsHistory= createSlice({
    name: "applicationHistory",
    initialState: {
        jobs:[]
    },
    reducers: {
 addJob: (state,action)=>{
    return {
...state,
jobs: [...state.jobs,action.payload]
    }}}
 })

  export const {addJob}= jobsHistory.actions;
  export default jobsHistory.reducer;