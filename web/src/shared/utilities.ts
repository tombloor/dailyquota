import { ReplacementMap } from "./interfaces/Replacement.interface";

export const allLetters = (chars: string[]): boolean => {
    let returnValue = true;
    chars.forEach((c) => {
        if (!isLetter(c)) {
            returnValue = false;
            return;
        }
    });

    return returnValue;
}

export const isLetter = (char: string): boolean => {
    return !(char.toUpperCase() === char.toLowerCase());
}

export const runReplacements = (originalText: string, r: ReplacementMap): string => {
    let replacedText = "";
    originalText.split('').forEach(char => {
        if(char.toLowerCase() in r) {
            let replacement = r[char.toLowerCase()];
            if(char === char.toUpperCase()) {
                replacedText += replacement.toUpperCase();
            } else {
                replacedText += replacement.toLowerCase();
            }
        } else {
            replacedText += char;
        }
    });

    return replacedText;
}

export enum CharacterState {
    NotLetter = -1,
    None = 0,
    Replaced = 1,
    Correct = 2
}
export const getCharacterStates = (originalText: string, replacements: ReplacementMap, correct: number[]): CharacterState[] => {
    let states: CharacterState[] = Array(originalText.length).fill(CharacterState.None);

    for(let i = 0; i < originalText.length; i++) {
        if (isLetter(originalText[i])) {
            if (correct.includes(i)) {
                states[i] = CharacterState.Correct
            } else if (originalText[i].toLowerCase() in replacements) {
                states[i] = CharacterState.Replaced;
            } else {
                states[i] = CharacterState.None
            }
        } else {
            states[i] = CharacterState.NotLetter;
        }
    }

    return states;
}