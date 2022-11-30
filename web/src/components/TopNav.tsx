
import { Link } from 'react-router-dom'

import HomeIcon from '@mui/icons-material/Home';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import GitHubIcon from '@mui/icons-material/GitHub';

import '../App.css';
import styles from './TopNav.module.css';

type NavProps = {
    siteName: string,
}

export default function TopNav(props: NavProps) {

    return (
        <header className={styles.siteHeader}>
            <h1 className={styles.siteTitle}>{props.siteName}</h1>
            <ul className={styles.menu}>
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
                    <a href='https://github.com/tombloor/dailyquota'>
                        <GitHubIcon titleAccess='GitHub' to='https://github.com/tombloor/dailyquota' />
                    </a>
                </li>
            </ul>
        </header>
    )
}
