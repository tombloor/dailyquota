import React, { useState } from 'react';
import styles from './Decoder.module.css';

type DecoderItemProps = {
    index: number,
    originalLetter: string,
    newLetter?: string,
    locked?: boolean,
    handleChange: (originalLetter: string, letter: string) => void
}

//TODO: For mobile we're going to need to make our own onscreen keyboard to handle these

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

    const onFocus = (event: React.FocusEvent) => {
        console.log(event);
        event.currentTarget.parentElement!.className = `${styles.decoderWrapper} ${styles.active}`;
    }

    const onBlur = (event: React.FocusEvent) => {
        console.log(event); 
        event.currentTarget.parentElement!.className = styles.decoderWrapper;
    }

    return (
        <label tabIndex={props.index} className={styles.decoderWrapper}>
            <input type='text' value={letter} onKeyDown={onKeyDown} readOnly={props.locked} onChange={()=>{}} onFocus={onFocus} onBlur={onBlur} />
            <div className={styles.decoderItem}>
                {props.originalLetter}
            </div>
        </label>
    )
}

