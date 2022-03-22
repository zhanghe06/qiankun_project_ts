import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
// import App from './App';
import Demo from './Demo';
import reportWebVitals from './reportWebVitals';
import {registerMicroApps, start} from 'qiankun'

ReactDOM.render(
  <React.StrictMode>
    <Demo />
  </React.StrictMode>,
  document.getElementById('root')
);

registerMicroApps([
    {
        name: 'app_react', // app name registered
        entry: '//localhost:3000',
        container: '#container',
        activeRule: '/app/react',
    },
    {
        name: 'app_vue',
        entry: '//localhost:8080',
        container: '#container',
        activeRule: '/app/vue',
    },
    // {
    //   name: 'app_angular',
    //   entry: '//localhost:4200',
    //   container: '#container',
    //   activeRule: '/app/angular',
    // },
]);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
