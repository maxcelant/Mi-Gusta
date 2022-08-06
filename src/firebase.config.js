// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAOf4Ip5TyfmoMKQejk5VMgvw5GF-YmYo8",
  authDomain: "mi-gusta-44b95.firebaseapp.com",
  projectId: "mi-gusta-44b95",
  storageBucket: "mi-gusta-44b95.appspot.com",
  messagingSenderId: "828354693273",
  appId: "1:828354693273:web:8d09fb120275e8ea7c9008"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore();