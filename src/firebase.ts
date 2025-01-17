// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth} from "firebase/auth"; 
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxqydq2kZ-qk19TvJfD7dUAXwz67V-2D0",
  authDomain: "drink-ordering-otp.firebaseapp.com",
  projectId: "drink-ordering-otp",
  storageBucket: "drink-ordering-otp.firebasestorage.app",
  messagingSenderId: "628547987398",
  appId: "1:628547987398:web:2e7b1a74049a8a73fcb4c7",
};


// Initialize Firebase
const app = getApps().length === 0 ? initializeApp(firebaseConfig): getApp();
const auth = getAuth(app);
auth.useDeviceLanguage();

export { auth };