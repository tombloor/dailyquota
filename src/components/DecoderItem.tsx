import React, { useState } from 'react';
import './Decoder.module.css';

type DecoderItemProps = {
    originalLetter: string,
    newLetter?: string,
    locked?: boolean,
    handleChange: (originalLetter: string, letter: string) => void
}

export function DecoderItem(props: DecoderItemProps) {

    const [letter, setLetter] = useState(props.newLetter ?? props.originalLetter);

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        // Check that this is a letter
        if (event.key.length == 1 && event.key.toLowerCase() != event.key.toUpperCase()) {
            setLetter(event.key.toLowerCase());
            props.handleChange(props.originalLetter, event.key.toLowerCase());
        } else {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    return (
        <div>
            <label>
                {props.originalLetter}<br />
                <input type='text' value={letter} onKeyDown={onKeyDown} readOnly={props.locked} onChange={()=>{}} />
            </label>
        </div>
    )
}

