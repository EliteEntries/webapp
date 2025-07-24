import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFunctions } from 'firebase/functions';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../../public/firebaseconfig';

// Firebase configuration is imported from public/firebaseconfig.ts

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);

// Initialize Firebase Functions
export const functions = getFunctions(app);

// Initialize Firestore
export const db = getFirestore(app);



export default app;