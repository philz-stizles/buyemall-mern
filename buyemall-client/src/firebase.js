// import * as firebase from "firebase/app"; // old way, wont work anymore
import firebase from "firebase/app";
import "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyB8H_J68N4F1zDfWXkW6qUmAbGmZU4yGQM",
  authDomain: "philz-ecommerce.firebaseapp.com",
  projectId: "philz-ecommerce",
  storageBucket: "philz-ecommerce.appspot.com",
  messagingSenderId: "677572347837",
  appId: "1:677572347837:web:2fbd509f39255e7180f4d4"
};

// initialize firebase app
if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

export const auth = firebase.auth();
export const googleAuth = new firebase.auth.GoogleAuthProvider();