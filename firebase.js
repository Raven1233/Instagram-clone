// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDb6LkV5D5klETECsCgV96dQB_sL6B-0zQ",
  authDomain: "insta-clone-cf48c.firebaseapp.com",
  projectId: "insta-clone-cf48c",
  storageBucket: "insta-clone-cf48c.appspot.com",
  messagingSenderId: "92780929424",
  appId: "1:92780929424:web:501cc4adb8c0eeb67d5315"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps();
const db = getFirestore();
const storage = getStorage();

export {app, db, storage} ;