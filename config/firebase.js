import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

const firebaseConfig = {
    apiKey: "AIzaSyBmkR6YddZ2JnBX-k2ek0lAMjxXgaQjTPw",
    authDomain: "busapp-51b2a.firebaseapp.com",
    projectId: "busapp-51b2a",
    storageBucket: "busapp-51b2a.appspot.com",
    messagingSenderId: "302532382292",
    appId: "1:302532382292:web:853d4bf33cf56b3978e7c1",
    measurementId: "G-E2E6SJL3DP"
  };

// initialize firebase
initializeApp(firebaseConfig);

export const auth = getAuth();
export const database = getFirestore();

// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getFirestore } from 'firebase/firestore';
// import Constants from 'expo-constants';
// // Firebase config
// // const firebaseConfig = {
// //   apiKey: Constants.manifest.extra.apiKey,
// //   authDomain: Constants.manifest.extra.authDomain,
// //   projectId: Constants.manifest.extra.projectId,
// //   storageBucket: Constants.manifest.extra.storageBucket,
// //   messagingSenderId: Constants.manifest.extra.messagingSenderId,
// //   appId: Constants.manifest.extra.appId,
// //   databaseURL: Constants.manifest.extra.databaseURL
// // };

// const firebaseConfig = {
//   apiKey: "AIzaSyC4pxNvK0mZuPE00yFYADhio8anP4rYhjs",
//   authDomain: "sairambusapp.firebaseapp.com",
//   projectId: "sairambusapp",
//   storageBucket: "sairambusapp.appspot.com",
//   messagingSenderId: "1002382086816",
//   appId: "1:1002382086816:web:376a06e16ad1ca21ffefc5"
// };
// // initialize firebase
// initializeApp(firebaseConfig);
// export const auth = getAuth();
// export const database = getFirestore();

