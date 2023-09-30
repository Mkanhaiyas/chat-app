import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDhWp4KJhkZX9snpPba6VQDtDxPEQ2AeVY",
  authDomain: "chat-app-55242.firebaseapp.com",
  projectId: "chat-app-55242",
  storageBucket: "chat-app-55242.appspot.com",
  messagingSenderId: "440861678741",
  appId: "1:440861678741:web:eedff83a29149ba07b4f9c",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const storage = getStorage();
export const db = getFirestore();
