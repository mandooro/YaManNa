import * as firebase from 'firebase'
let database;
let config = {
    apiKey: "",
    authDomain: "",
    databaseURL: "",
    projectId: "",
    storageBucket: "",
    messagingSenderId: "",
    appId: ""
}

export const fire = () => {
    if (!firebase.apps.length) {
        firebase.initializeApp(config);
    }
    database = firebase.database()
}

export const getFireDB = () => {
    return database
}
