import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

function startApp() {
  window.Kakao.init('79ca9d50ec5b44afee5b11a1c19903d1');
  ReactDOM.render(<App />, document.getElementById('root'));
}

startApp();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.register();
