// Import the functions you need from the SDKs you need
import * as firebase from "firebase/app";
// import { getAuth, onAuthStateChanged } from "firebase/auth";
import { initializeAuth, getReactNativePersistence, getAuth } from 'firebase/auth/react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBs8X8O7zwmt_vkmHKzxkQjNxEakOkF_7k",
  authDomain: "photohandler-67bdc.firebaseapp.com",
  projectId: "photohandler-67bdc",
  storageBucket: "photohandler-67bdc.appspot.com",
  messagingSenderId: "542416995007",
  appId: "1:542416995007:web:ee78a2ee0ed8f0b485bc0a"
};

// Initialize Firebase
let app;
if(firebase.getApps.length === 0){
  app = firebase.initializeApp(firebaseConfig);
} else {
  app = firebase.getApp()
}

// try{
//   app = firebase.getInstance();
// }
// catch (IllegalStateException)
// {
//   app = firebase.initializeApp(firebaseConfig);
// }


// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage)
// });

const auth = getAuth(app, {persistence: getReactNativePersistence(AsyncStorage)});
export { auth };