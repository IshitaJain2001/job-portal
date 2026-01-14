import { createSlice } from "@reduxjs/toolkit";
import logininitialState from "./logininitialState";

 let loginSlice=  createSlice({
   name:"login",
   initialState:logininitialState,
   reducers:{
    addUser: (state,action)=>{
return {
    ...state,isLoggedIn: true,user:action.payload.user
}},
    removeUser:(state,action)=>{
        return {...state,isLoggedIn: false,user:null 
        } }}})

  export const {addUser, removeUser}= loginSlice.actions;
  export default loginSlice.reducer;