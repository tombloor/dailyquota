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