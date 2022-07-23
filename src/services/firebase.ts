import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: "AIzaSyDsv0YlsAvltMk9nNyMJ2wJ_urwWzEgUwY",
    authDomain: "dailyquota.firebaseapp.com",
    projectId: "dailyquota",
    storageBucket: "dailyquota.appspot.com",
    messagingSenderId: "195807825155",
    appId: "1:195807825155:web:483241a8b46caa71766d36",
    measurementId: "G-BESGH6DH6W"
};

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
