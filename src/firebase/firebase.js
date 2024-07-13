import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore'; 
import { getAuth } from 'firebase/auth'; 
import { getDatabase } from 'firebase/database';


// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "pivot-9b455.firebaseapp.com",
  databaseURL: "https://pivot-9b455-default-rtdb.firebaseio.com",
  projectId: "pivot-9b455",
  storageBucket: "pivot-9b455.appspot.com",
  messagingSenderId: "812213133187",
  appId: "1:812213133187:web:1135639a83171a194160b6",
  measurementId: "G-VEJP8ZE4K0"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app)
const database = getDatabase(app);

export {app, auth, database}