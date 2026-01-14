import { createSlice } from "@reduxjs/toolkit";

 const inputSlice= createSlice({
   name :"userInput",
   initialState: {
    value:""} ,
   reducers:{
    userSearch: (state,action)=>{
        return {
            ...state,
            value:action.payload
        }}}})

        export let {userSearch}= inputSlice.actions
        export default userSearch.reducer; 