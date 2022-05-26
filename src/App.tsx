import React from 'react';
import logo from './logo.svg';
import TopNav from './components/TopNav'
import './App.css';

import { Outlet } from 'react-router-dom';


function App() {
  return (
    <div className='app'>
      <TopNav siteName='Daily Quota' />
      <main>
        <Outlet />
      </main>
      <footer>
        Footer content goes here
      </footer>
    </div>
  );
}

export default App;
