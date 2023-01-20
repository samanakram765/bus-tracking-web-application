import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyBRk1HgYdYzoqvjnI5aeDPCPu7nkHbqR7U",
  authDomain: "bus-tracking-app-backend.firebaseapp.com",
  projectId: "bus-tracking-app-backend",
  storageBucket: "bus-tracking-app-backend.appspot.com",
  messagingSenderId: "204843320445",
  appId: "1:204843320445:web:6b4979e74317cc1e8c5d14",
};

// const firebaseConfig = {
//   apiKey: "AIzaSyCorqrR_mWth3eHYfal2oxYlqxGdR2aYQg",
//   authDomain: "bus-tracking-app-66bb7.firebaseapp.com",
//   projectId: "bus-tracking-app-66bb7",
//   storageBucket: "bus-tracking-app-66bb7.appspot.com",
//   messagingSenderId: "680349126006",
//   appId: "1:680349126006:web:6d0cb263128d5e7bb5fe57",
// };

const app = initializeApp(firebaseConfig);
export const database = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);
