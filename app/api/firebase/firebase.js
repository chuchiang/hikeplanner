// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries


import {getAuth,} from 'firebase/auth';

 // 用來創造一個 firestore 實例
import {getFirestore,} from 'firebase/firestore';


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAvsXPfUsClaVpw_kHVupFPzBzxa2wrf3M",
  authDomain: "hikeplanner-58438.firebaseapp.com",
  projectId: "hikeplanner-58438",
  storageBucket: "hikeplanner-58438.appspot.com",
  messagingSenderId: "167989222026",
  appId: "1:167989222026:web:1786d947e13f9e455e2b73"
};


export const ACCOINTING_COLLECTION_NAME = 'hikeplanner';


// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication 
export const auth = getAuth(app);
export const db = getFirestore(app);

