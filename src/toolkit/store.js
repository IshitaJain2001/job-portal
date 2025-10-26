import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "./LoginSlice"
import applicationHistory from "./applicationSlice"
  const store= configureStore({
    reducer:{
        login: loginReducer,
        applicationHistory: applicationHistory
    }
  })

  export default store;