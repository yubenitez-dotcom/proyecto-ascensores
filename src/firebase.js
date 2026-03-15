import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDhhuAATsMWs9mGO2cqLaNHmBY6rQwBnjE",
  authDomain: "elevatorpro-3c25a.firebaseapp.com",
  projectId: "elevatorpro-3c25a",
  storageBucket: "elevatorpro-3c25a.firebasestorage.app",
  messagingSenderId: "562314344117",
  appId: "1:562314344117:web:634eb446d6b1be99e270fc",
  measurementId: "G-L2CM1DF79J"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
