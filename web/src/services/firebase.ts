/*eslint no-restricted-globals: ["warn"]*/

import { initializeApp } from 'firebase/app';
//import { getFirestore } from 'firebase/firestore';
import { getAnalytics } from 'firebase/analytics';
import { getFunctions, connectFunctionsEmulator } from 'firebase/functions';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';


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
//export const db = getFirestore(app);
export const analytics = getAnalytics(app);

export const functions = getFunctions(app);
// We are running in the firebase emulator environment
if (window.location.hostname === "localhost" && window.location.port === "5000") {
    //@ts-ignore
    self.FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    connectFunctionsEmulator(functions, "localhost", 5001);
}

export const appCheck = initializeAppCheck(app, { 
    provider: new ReCaptchaV3Provider('6LcX4hEiAAAAAIaDIfXsD8ca9hrTupH-dVpLGNY9'),
    isTokenAutoRefreshEnabled: true
});

