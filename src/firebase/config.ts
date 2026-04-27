import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  apiKey: 'AIzaSyBn-6P21VFIKhiPUVxT6LO-ootm8RtziqY',
  authDomain: 'chaiyo-7fddb.firebaseapp.com',
  databaseURL: 'https://chaiyo-7fddb-default-rtdb.firebaseio.com',
  projectId: 'chaiyo-7fddb',
  storageBucket: 'chaiyo-7fddb.firebasestorage.app',
  messagingSenderId: '433148156822',
  appId: '1:433148156822:web:185195ef149b4de31fdbb7',
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getDatabase(app, firebaseConfig.databaseURL);
