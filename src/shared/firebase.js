import * as firebase from 'firebase'
let database;
let config = {
    apiKey: "AIzaSyDCmpQf8AfBOwVk1qTl8hDc9x6Mb1pzQuA",
    authDomain: "yamanna-6ebcd.firebaseapp.com",
    databaseURL: "https://yamanna-6ebcd.firebaseio.com",
    projectId: "yamanna-6ebcd",
    storageBucket: "",
    messagingSenderId: "897379115354",
    appId: "1:897379115354:web:9e78ee9fe5225bcc"
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
