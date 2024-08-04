// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDtudM0qFbverlHdu-v4eSc1cnNuTjHprg",
  authDomain: "inventory-management-59d76.firebaseapp.com",
  projectId: "inventory-management-59d76",
  storageBucket: "inventory-management-59d76.appspot.com",
  messagingSenderId: "1015793616083",
  appId: "1:1015793616083:web:92c3bb45ff5f19d8970026",
  measurementId: "G-N2PXFDZ31V"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
if (typeof window!== 'undefined'){
    const analytics = getAnalytics(app);
}
const firestore= getFirestore(app);
export {firestore}