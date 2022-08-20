import React from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
//import { auth } from '../firebase-config';

export const loginRequest = (email, password) => {
    signInWithEmailAndPassword(email, password);
}