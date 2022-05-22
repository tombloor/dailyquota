import React from 'react';
import logo from './logo.svg';
import TopNav from './TopNav'
import './App.css';

import { Outlet } from 'react-router-dom';

import HomeIcon from '@mui/icons-material/Home';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import RateReviewIcon from '@mui/icons-material/RateReview';


function App() {
  return (
    <div className='app'>
      <TopNav siteName='Daily Quota'>
        <HomeIcon titleAccess='Home' />
        <LeaderboardIcon titleAccess='Leaderboard' />
        <RateReviewIcon titleAccess='Feedback' />
      </TopNav>

      <main>
        Main component of the page goes here. This will be the outlet.
        <Outlet />
      </main>
      <footer>
        Footer content goes here
      </footer>
    </div>
  );
}

export default App;
