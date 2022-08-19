import { MouseEventHandler } from "react"
import styles from "./KeyboardInput.module.css"

export interface KeyboardInputProps {
    onCursorBack: MouseEventHandler<HTMLElement>,
    onCursorForward: MouseEventHandler<HTMLElement>,
    onKeyPress: (char: string) => void
}

export const KeyboardInput = (props: KeyboardInputProps) => {

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
                <button onClick={props.onCursorBack}>&lt;</button>
                <button onClick={props.onCursorForward}>&gt;</button>
                <button onClick={() => props.onKeyPress('')}>Clear</button>
            </div>
        </div>
    )
}