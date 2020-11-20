import firebase from "firebase/app";

const firebaseConfig = {
  apiKey: "AIzaSyB44ZDawgv37aAnex0z9Y7USYVQ02F0qpg",
  authDomain: "curso-restaurantes-1139e.firebaseapp.com",
  databaseURL: "https://curso-restaurantes-1139e.firebaseio.com",
  projectId: "curso-restaurantes-1139e",
  storageBucket: "curso-restaurantes-1139e.appspot.com",
  messagingSenderId: "350842644750",
  appId: "1:350842644750:web:957c66a3074272882f0f5f",
};
// Initialize Firebase
export const firebaseApp = firebase.initializeApp(firebaseConfig);
