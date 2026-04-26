import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAvjcFJN4thwhNrirgalpBbw3AlF2dyn38',
  authDomain: 'mobile-application-bdf80.firebaseapp.com',
  databaseURL: 'https://mobile-application-bdf80-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'mobile-application-bdf80',
  storageBucket: 'mobile-application-bdf80.firebasestorage.app',
  messagingSenderId: '53277665213',
  appId: '1:53277665213:web:f41fd0d90221e5049554d4',
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app, firebaseConfig.databaseURL);
export const auth = getAuth(app);
