import { initializeApp } from 'firebase/app';
//const { getFirestore, Timestamp, FieldValue } = require('firebase-admin/firestore');
import { getFirestore } from'firebase/firestore';

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
    apiKey: "AIzaSyBs8X8O7zwmt_vkmHKzxkQjNxEakOkF_7k",
    authDomain: "photohandler-67bdc.firebaseapp.com",
    projectId: "photohandler-67bdc",
    storageBucket: "photohandler-67bdc.appspot.com",
    messagingSenderId: "542416995007",
    appId: "1:542416995007:web:ee78a2ee0ed8f0b485bc0a"
  };

export const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
