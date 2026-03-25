import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBrp4kcgjuUJLQ5KLt0rberGRCIIBcy-x4",
  authDomain: "voxbattle-8d0c0.firebaseapp.com",
  databaseURL:
    "https://voxbattle-8d0c0-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "voxbattle-8d0c0",
  storageBucket: "voxbattle-8d0c0.firebasestorage.app",
  messagingSenderId: "1008316824962",
  appId: "1:1008316824962:ios:00e2be77a8f52f56de239b",
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export const auth = getAuth(app);
export default app;
