import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyBOlvnNt2XwBJfT7QbjmgaD4SwKuQ1u1Q8",
    authDomain: "chameleon-ccfcb.firebaseapp.com",
    databaseURL: "https://chameleon-ccfcb-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "chameleon-ccfcb",
    storageBucket: "chameleon-ccfcb.firebasestorage.app",
    messagingSenderId: "989612699596",
    appId: "1:989612699596:web:9ee09785e3244e6c3e3769"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const database = getDatabase(app);

export default app;