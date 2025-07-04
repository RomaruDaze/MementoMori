import { initializeApp } from "firebase/app";
import { getAI, getGenerativeModel, GoogleAIBackend } from "firebase/ai";

const firebaseConfig = {
  apiKey: "AIzaSyDalosh4P-xxKRwtI5tb1O34rwZ_kdDzOw",
  authDomain: "memento-mori-7ecb1.firebaseapp.com",
  projectId: "memento-mori-7ecb1",
  storageBucket: "memento-mori-7ecb1.firebasestorage.app",
  messagingSenderId: "972385322512",
  appId: "1:972385322512:web:d1cbbd6915521c53bfec95",
  measurementId: "G-4FY73FGWSC",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize the Gemini Developer API backend service
const ai = getAI(app, { backend: new GoogleAIBackend() });

// Create a GenerativeModel instance
const model = getGenerativeModel(ai, { model: "gemini-2.5-flash" });

export { model };

export default app;
