import firebase from 'firebase/app';
import 'firebase/database';

let database;
const config = {
  apiKey: '',
  authDomain: '',
  databaseURL: '',
  projectId: '',
  storageBucket: '',
  messagingSenderId: '',
  appId: '',
};

export const fire = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(config);
  }
  database = firebase.database();
};

export const getFireDB = () => database;
