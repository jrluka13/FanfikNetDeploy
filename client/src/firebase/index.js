import firebase from "firebase/app";
import "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyB2VYJvTVVJ43PGelRKLxHDefcn6JGv6UU",
  authDomain: "fanfiknet-c286b.firebaseapp.com",
  projectId: "fanfiknet-c286b",
  storageBucket: "fanfiknet-c286b.appspot.com",
  messagingSenderId: "293643795824",
  appId: "1:293643795824:web:5c78c2eb6d9545556363b5",
  measurementId: "G-4Y1QGX2RNL",
};

firebase.initializeApp(firebaseConfig);

const storage = firebase.storage();

export { storage, firebase as default };
