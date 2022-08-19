import { useState } from "react";
import { allLetters, isLetter } from "../shared/utilities";
import { Highlighter } from "./Highlighter";
import { KeyboardInput } from "./KeyboardInput";

export interface DecoderProps {
    original_text: string,
    modified_text: string,
    author: string,
    updateCharacter: (oldChar: string, newChar: string) => void
}

export const Decoder = (props: DecoderProps) => {
    const [cursorPosition, setCursorPosition] = useState(0);

    const moveCursorBack = () => {
        if (cursorPosition > 0) {
            setCursorPosition(cursorPosition - 1);
        }
    }

    const moveCursorForward = () => {
        if (cursorPosition < props.original_text.length) {
            setCursorPosition(cursorPosition + 1);
        }
    }

    const replaceCharacter = (newChar: string) => {
        const oldChar = props.original_text[cursorPosition].toLowerCase();

        if (isLetter(oldChar)) {
            if (isLetter(newChar)) {
                props.updateCharacter(oldChar, newChar);
                moveCursorForward();
            } else {
                props.updateCharacter(oldChar, newChar);
            }
        }
    }

    return (
        <div>
            <Highlighter original={props.original_text} modified={props.modified_text} cursorPosition={cursorPosition}></Highlighter>
            <i>{props.author}</i>
            <KeyboardInput onCursorBack={moveCursorBack} onCursorForward={moveCursorForward} onKeyPress={replaceCharacter}></KeyboardInput>
        </div>
    )
}