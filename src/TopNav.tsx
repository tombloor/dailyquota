
import { Children } from 'react';

import './App.css';
import './TopNav.module.css';

type NavProps = {
    siteName: string,
    children: React.ReactNode
}

export default function TopNav(props: NavProps) {

    return (
        <header>
            <h1>{props.siteName}</h1>
            <ul>
                {
                    Children.map(props.children, (item, index) => {
                        return <li>{item}</li>
                    })
                }
            </ul>
        </header>
    )
}
