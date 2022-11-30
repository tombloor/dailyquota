import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <>
            <h2>Welcome to Daily Quota!</h2>

            <div className="homeLinks">
                <Link to='/daily' className='disabled-link'>
                    <EmojiEventsIcon titleAccess='Daily Challenge' to='/daily' />
                    <p>
                        Daily Challenge
                        <br/>
                        <small><i>(Coming soon...)</i></small>
                    </p>
                </Link>
                <Link to='/practice'>
                    <FitnessCenterIcon titleAccess='Practice' to='/practice' />
                    <p>Practice</p>
                </Link>
            </div>
        </>
    )
}