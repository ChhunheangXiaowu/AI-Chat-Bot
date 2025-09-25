import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { 
  getAuth, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut 
} from "firebase/auth";

// Your web app's Firebase configuration from the prompt
const firebaseConfig = {
  apiKey: "AIzaSyAviXAzUk3G_oInyYql401xVX94I-GmOGs",
  authDomain: "ai-chatbot-434f1.firebaseapp.com",
  projectId: "ai-chatbot-434f1",
  storageBucket: "ai-chatbot-434f1.firebasestorage.app",
  messagingSenderId: "768495308848",
  appId: "1:768495308848:web:762ceef354841a22399df5",
  measurementId: "G-N7NZT8TCYX"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export const signInWithGoogle = () => {
  return signInWithPopup(auth, provider);
};

export const signOut = () => {
  return firebaseSignOut(auth);
};