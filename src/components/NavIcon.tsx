import { Link } from 'react-router-dom'
import { SvgIcon } from '@mui/material';

type NavIconProps = {
    Icon: typeof SvgIcon,
    text: string,
    to: string
}

export default function NavIcon({Icon, text, to}: NavIconProps) {
    return (
        <Link to={to}>
            <Icon titleAccess={text} />
        </Link>
    )
}