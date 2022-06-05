import React, { useState } from 'react';
import styles from './Decoder.module.css';

type DecoderItemProps = {
    originalLetter: string,
    newLetter?: string,
    locked?: boolean,
    handleChange: (originalLetter: string, letter: string) => void
}

export function DecoderItem(props: DecoderItemProps) {
    const letter = props.newLetter ?? props.originalLetter

    const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        // Check that this is a letter
        if (event.key.length == 1 && event.key.toLowerCase() != event.key.toUpperCase()) {
            props.handleChange(props.originalLetter, event.key.toLowerCase());
        } else {
            event.preventDefault();
            event.stopPropagation();
        }
    }

    return (
        <div className={styles.decoderItem}>
            <label>
                {props.originalLetter}<br />
                <input type='text' value={letter} onKeyDown={onKeyDown} readOnly={props.locked} onChange={()=>{}} />
            </label>
        </div>
    )
}

