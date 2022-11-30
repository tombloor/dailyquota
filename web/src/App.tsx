import React from 'react';
import logo from './logo.svg';
import TopNav from './components/TopNav';
import Footer from './components/Footer';
import './App.css';

import { Outlet } from 'react-router-dom';


function App() {
  return (
    <div className='app'>
      <TopNav siteName='Daily Quota' />
      <main >
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default App;
