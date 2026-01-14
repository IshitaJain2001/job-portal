
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyC63bZG2xdzYAcVJ5Hzq-SzgBV_5FdAiC4",
  authDomain: "react-job-portal-app.firebaseapp.com",
  projectId: "react-job-portal-app",
  storageBucket: "react-job-portal-app.firebasestorage.app",
  messagingSenderId: "286613523487",
  appId: "1:286613523487:web:c18f1a08cdacd4d5dc992a"
};
const app = initializeApp(firebaseConfig);
const auth= getAuth(app)
const provider = new GoogleAuthProvider()

export {auth, provider};