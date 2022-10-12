import { useState } from "react";
import { isLetter, CharacterState } from "../shared/utilities";
import { Highlighter } from "./Highlighter";
import { KeyboardInput } from "./KeyboardInput";

export interface DecoderProps {
    original_text: string,
    modified_text: string,
    author: string,
    characterStates: CharacterState[],
    updateCharacter: (oldChar: string, newChar: string) => void
}

export const Decoder = (props: DecoderProps) => {
    const [cursorPosition, setCursorPosition] = useState(0);

    const editableStates = [CharacterState.None, CharacterState.Replaced];

    const moveCursorForward = () => {
        let newPosition = cursorPosition + 1;

        while (newPosition < props.characterStates.length && !editableStates.includes(props.characterStates[newPosition])) {
            newPosition += 1;
        }

        if (newPosition < props.characterStates.length) {
            setCursorPosition(newPosition);
        }
    }

    const moveCursorBack = (erase = false) => {
        let newPosition = cursorPosition - 1;

        while (newPosition >= 0 && !editableStates.includes(props.characterStates[newPosition])) {
            newPosition -= 1;
        }

        if (newPosition >= 0) {
            setCursorPosition(newPosition);
            if (erase) {
                const oldChar = props.original_text[newPosition].toLowerCase();
                props.updateCharacter(oldChar, '');
            }
        }
    }

    const replaceCharacter = (newChar: string) => {
        let state = props.characterStates[cursorPosition];
        if(state != CharacterState.Correct && state != CharacterState.NotLetter) {
            const oldChar = props.original_text[cursorPosition].toLowerCase();

            if (isLetter(newChar)) {
                props.updateCharacter(oldChar, newChar);
                moveCursorForward();
            } else {
                props.updateCharacter(oldChar, newChar);
            }
        } else {
            moveCursorForward();
        }
    }

    return (
        <div>
            <Highlighter text={props.modified_text} cursorPosition={cursorPosition} characterStates={props.characterStates}></Highlighter>
            <i>{props.author}</i>
            <KeyboardInput onCursorBack={moveCursorBack} onCursorForward={moveCursorForward} onKeyPress={replaceCharacter}></KeyboardInput>
        </div>
    )
}