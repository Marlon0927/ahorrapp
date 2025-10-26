// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBNihLKjSQODe0Dy_DafxntdKfApWerD3A",
    authDomain: "proyecto-final-f49a8.firebaseapp.com",
    projectId: "proyecto-final-f49a8",
    storageBucket: "proyecto-final-f49a8.firebasestorage.app",
    messagingSenderId: "988495732637",
    appId: "1:988495732637:web:58e8e7da9c60e297bb5974",
    measurementId: "G-Q9SCLGFD71"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);