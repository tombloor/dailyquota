import React, { useEffect } from "react"
import { isLetter } from "../shared/utilities";
import styles from "./KeyboardInput.module.css"

export interface KeyboardInputProps {
    onCursorBack: (erase?: boolean) => void,
    onCursorForward: () => void,
    onKeyPress: (char: string) => void
}

export const KeyboardInput = (props: KeyboardInputProps) => {

    useEffect(() => {
        const handleKeypress = (event: KeyboardEvent) => {
            if (event.key.length === 1 && isLetter(event.key)) {
                props.onKeyPress(event.key);
            } else {
                switch (event.key) {
                    case "ArrowLeft":
                        props.onCursorBack();
                        break;
                    case "ArrowRight":
                        props.onCursorForward();
                        break;
                    case "Delete":
                        props.onKeyPress('');
                        break;
                    case "Backspace":
                        props.onCursorBack(true);
                }
            }
        };

        window.addEventListener("keydown", handleKeypress, false);
        return () => {
          window.removeEventListener("keydown", handleKeypress, false);
        };
      }, [props]);

    return (
        <div className={styles.keyboard}>
            <div className={styles.keyboardRow}>
                { 
                    'qwertyuiop'.split('').map((char) => {
                        return <button onClick={() => props.onKeyPress(char)}>{char}</button>
                    }) 
                }
            </div>
            <div className={styles.keyboardRow}>
                { 
                    'asdfghjkl'.split('').map((char) => {
                        return <button onClick={() => props.onKeyPress(char)}>{char}</button>
                    }) 
                }
            </div>
            <div className={styles.keyboardRow}>
                { 
                    'zxcvbnm'.split('').map((char) => {
                        return <button onClick={() => props.onKeyPress(char)}>{char}</button>
                    }) 
                }
                <button onClick={() => props.onCursorBack}>&lt;</button>
                <button onClick={() => props.onCursorForward}>&gt;</button>
                <button onClick={() => props.onKeyPress('')}>Clear</button>
            </div>
        </div>
    )
}