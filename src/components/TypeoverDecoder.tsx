import {useEffect, useState, useRef} from 'react';
import styles from './TypeoverDecoder.module.css';

export type DecoderProps = {
    originalText: string,
    startingReplacements?: ReplacementMap,
    onChange: (newText: string) => void
}

export type ReplacementMap = {
    [original: string]: string
}

export function TypeoverDecoder({
    originalText, startingReplacements, onChange
}: DecoderProps) {

    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [replacements, setReplacements] = useState(startingReplacements ?? {});
    const [elements, setElements] = useState<JSX.Element[]>([]);
 
    useEffect(() => {
        let text = runReplacements(replacements);
        setElements(getElements(text));
        onChange(text);
    }, [replacements]);

    useEffect(() => {
        if (textareaRef.current!.hasAttribute('cursorposition')) {
            setTimeout(() => {
                // Android needs this otherwise the cursor doesn't move
                // If you type too fast it still messes up, so will need to revisit that 
                let pos = parseInt(textareaRef.current!.getAttribute('cursorposition')!);
                moveCursor(pos);
            }, 0);
        }
    });

    const runReplacements = (r: ReplacementMap): string => {
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

    const getElements = (t: string): JSX.Element[] => {
        let arr = [];
        let currentText = "";
        let currentClass = "";
        let key = 0;

        for(let i = 0; i < t.length; i++) {
            if(t[i] == originalText[i]) {
                if(currentClass == "") {
                    currentText += t[i];
                } else {
                    if(currentText.length > 0) {
                        arr.push(<span key={key} className={currentClass}>{currentText}</span>);
                        key++;
                    }
                    currentText = t[i];
                    currentClass = "";
                }
            } else {
                if (currentClass == styles.replaced) {
                    currentText += t[i];
                } else {
                    if(currentText.length > 0) {
                        arr.push(<span key={key} className={currentClass}>{currentText}</span>);
                        key++;
                    }
                    currentText = t[i];
                    currentClass = styles.replaced;
                }
            }
        }

        if(currentText) {
            arr.push(<span key={key} className={currentClass}>{currentText}</span>);
        }

        return arr;
    }

    const getCursorPosition = () => {
        return textareaRef.current!.selectionEnd;
    }

    const moveCursor = (position: number) => {
        if (position <= 0)
        {
            textareaRef.current!.selectionStart = 0;
            textareaRef.current!.selectionEnd = 0;
        }
        else if (position >= originalText.length)
        {
            textareaRef.current!.selectionStart = originalText.length;
            textareaRef.current!.selectionEnd = originalText.length;
        }
        else
        {
            textareaRef.current!.selectionStart = position;
            textareaRef.current!.selectionEnd = position;
        }
    }

    const isEditableCharacter = (position: number) => 
    {
        if (position >= originalText.length)
            return false;
        else if (position < 0)
            return false;
        else
            return originalText[position].toLowerCase() !== originalText[position].toUpperCase();
    }

    const onInput = (position: number, character: string | null) => {
        if (isEditableCharacter(position))
        {
            let toReplace = originalText[position].toLowerCase();
            let r = {...replacements};
            if (character && character.toLowerCase() != character.toUpperCase()) 
            {
                r[toReplace] = character;
            }
            else
            {
                delete r[toReplace];
            }
            setReplacements(r);
        }
    }

    let lastTextContent: string | null;
    let lastCursorPosition: number | null;
    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        lastTextContent = null;
        lastCursorPosition = null;

        if(event.key.startsWith('Arrow')) return;

        event.preventDefault();

        let cursorPosition = getCursorPosition();

        if (event.key === 'Delete')
        {
            onInput(cursorPosition, null);
        }
        else if (event.key === 'Backspace')
        {
            if (cursorPosition > 0)
            {
                onInput(cursorPosition - 1, null);
            }
            moveCursor(cursorPosition - 1);
        }
        else if (event.key === ' ')
        {
            moveCursor(cursorPosition + 1);
        }
        else if (event.key.length === 1 && event.key.toUpperCase() !== event.key.toLowerCase()) {
            onInput(cursorPosition, event.key);
            moveCursor(cursorPosition + 1);
        }
    }
    const onKeyDownLegacy = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        lastTextContent = textareaRef.current!.textContent;
        lastCursorPosition = getCursorPosition();
    }
    const handleInput = (event: React.FormEvent<HTMLTextAreaElement>) => {
        if (lastTextContent && lastCursorPosition !== null) {
            let newCursorPosition = lastCursorPosition;
            let updated = false;

            if (lastTextContent.length > event.currentTarget.value.length) {
                // This is a backspace
                newCursorPosition -= 1;
            } else {
                // This is an input
                newCursorPosition += 1;
            }

            for(let i = 0; i < event.currentTarget.value.length; i++) {
                let newChar = event.currentTarget.value[i];
                let oldChar = lastTextContent[i];
                if (newChar.toLowerCase() != oldChar.toLowerCase() && oldChar.toLowerCase() != oldChar.toUpperCase()) {
                    onInput(i, newCursorPosition > lastCursorPosition ? newChar : null);
                    updated = true;
                    break;
                }
            }
            textareaRef.current!.setAttribute('cursorposition', newCursorPosition.toString());
            if (!updated) {
                setReplacements(replacements); // Force a state update otherwise the cursor goes nuts
            }
        }
    }

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (!event.code) {
            onKeyDownLegacy(event);
        } else {
            onKeyDown(event);
        }
    }

    return (
        <div className={styles.decoderContainer}>
            <textarea 
                ref={textareaRef} className={styles.decoderInput} value={originalText}
                onKeyDown={handleKeyDown} onInput={handleInput} onChange={() => { }}
                autoCapitalize="off" autoComplete="off" spellCheck="false" autoCorrect="off"></textarea>
            <pre className={styles.decoderOutput}>{elements}</pre>
        </div>
    )
}
