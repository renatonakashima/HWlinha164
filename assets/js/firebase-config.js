import { initializeApp } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-app.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/12.4.0/firebase-firestore.js";

// A configuração de um app web Firebase é pública por definição.
// A segurança real é aplicada pelas regras do Cloud Firestore.
const firebaseConfig = {
  apiKey: "AIzaSyDmAuwXJJoDadDzeadRNL2A8LdZyXaYPr8",
  authDomain: "hwlinha164.firebaseapp.com",
  projectId: "hwlinha164",
  storageBucket: "hwlinha164.firebasestorage.app",
  messagingSenderId: "649471893590",
  appId: "1:649471893590:web:9747c324847f2e63425bf7",
  measurementId: "G-N2NBQ6F4MW",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };
