import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import Home from './routes/Home';
import Leaderboard from './routes/Leaderboard';
import Practice from './routes/Practice';

import {
  BrowserRouter,
  Route,
  Routes,
  Navigate
} from 'react-router-dom';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<App />}>
          <Route index element={<Home />} />
          <Route path='/home' element={<Home />} />
          <Route path='/leaderboard' element={<Leaderboard />} />
          <Route path='/practice' element={<Practice />} />
          <Route path="*" element={<Navigate to='/' />}>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
