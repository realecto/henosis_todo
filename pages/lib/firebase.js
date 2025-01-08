// Import the functions you need from the SDKs you need
import { getApps, initializeApp } from "firebase/app";
import "firebase/auth"
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import "firebase/firestore"
import { collection, getDocs, getFirestore, limit, query, where } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional

// PASTE FIREBASE CONFIG HERE

// Initialize Firebase
if (!getApps.length){
    initializeApp(firebaseConfig);
}

export const auth = getAuth();
export const firestore = getFirestore();
export const googleAuth = new GoogleAuthProvider();

export async function getListWithID(list_uid)  {

  const todosRef = collection(firestore, 'todo')
  const q = query(todosRef, where("uid", "==", list_uid), limit(1)); 
  
  const todoDocs = await getDocs(q);
  const itemDoc = todoDocs.docs[0]

  return itemDoc
}
