// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCvZKT2suHzxoNNmVC9n-e22WyZyVKaKGE",
  authDomain: "aaryastays-783f5.firebaseapp.com",
  projectId: "aaryastays-783f5",
  storageBucket: "aaryastays-783f5.appspot.com",
  messagingSenderId: "706593754742",
  appId: "1:706593754742:web:e10a858927052d0dc2d957",
  measurementId: "G-WTLWC75TQC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const authentication = getAuth(app);
