
import { Link } from 'react-router-dom'

import HomeIcon from '@mui/icons-material/Home';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import RateReviewIcon from '@mui/icons-material/RateReview';

import '../App.css';
import './TopNav.module.css';

type NavProps = {
    siteName: string,
}

export default function TopNav(props: NavProps) {

    return (
        <header>
            <h1>{props.siteName}</h1>
            <ul>
                <li>
                    <Link to='/home'>
                        <HomeIcon titleAccess='Home' to='/home' />
                    </Link>
                </li>
                <li>
                    <Link to='/leaderboard'>
                        <LeaderboardIcon titleAccess='Leaderboard' to='/leaderboard' />
                    </Link>
                </li>
                <li>
                    <Link to='/feedback'>
                        <RateReviewIcon titleAccess='Feedback' to='/feedback' />
                    </Link>
                </li>
            </ul>
        </header>
    )
}
