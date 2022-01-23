import firebase from "firebase/compat/app";
import "firebase/compat/firestore";
import "firebase/compat/auth";

var config = {
  apiKey: "AIzaSyCqBYrzyZKpe54vXrsHdt7ctzAhIRCeNGk",
  authDomain: "azum-ebae8.firebaseapp.com",
  databaseURL: "https://azum-ebae8-default-rtdb.firebaseio.com",
  projectId: "azum-ebae8",
  storageBucket: "azum-ebae8.appspot.com",
  messagingSenderId: "780851577476",
  appId: "1:780851577476:web:4f696f2eda89de918038d1",
};

firebase.initializeApp(config);

const db = firebase.firestore();

// date issue fix according to firebase
const settings = {
  timestampsInSnapshots: true,
};
db.settings(settings);

export { db };
