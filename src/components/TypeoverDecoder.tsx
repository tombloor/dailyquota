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
    const [newText, setNewText] = useState(<></>);
 
    useEffect(() => {
        runReplacements();
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
    
    const runReplacements = () => {
        let key = 0;
        let elements: JSX.Element[] = [];
        let currentClass = '';
        let currentText = '';

        originalText.split('').forEach(character => {
            if(character.toLowerCase() in replacements)
            {
                let replacement = replacements[character.toLowerCase()];
                if (character === character.toUpperCase())
                    replacement = replacement.toUpperCase();

                if (currentClass === 'replaced')
                {
                    currentText += replacement;
                }
                else
                {
                    if (currentText.length > 0)
                        elements.push(<span key={key}>{currentText}</span>);
                    currentClass = 'replaced';
                    currentText = replacement;
                    key++;
                }
            }
            else
            {
                if (currentClass === 'replaced')
                {
                    if (currentText.length > 0)
                        elements.push(<span key={key} className={styles.replaced}>{currentText}</span>);
                    currentClass = '';
                    currentText = character;
                    key++;
                }
                else
                {
                    currentText += character;
                }
            }
        });

        if (currentText.length > 0)
        {
            if (currentClass === 'replaced')
            {
                elements.push(<span key={key} className={styles.replaced}>{currentText}</span>);
            }
            else
            {
                elements.push(<span key={key}>{currentText}</span>);
            }
        }

        setNewText(<>{elements.map((e) => e)}</>);
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
            if (lastTextContent.length > event.currentTarget.value.length) {
                // This is a backspace
                let updated = false;
                // This is an input
                for(let i = 0; i < event.currentTarget.value.length; i++) {
                    let newChar = event.currentTarget.value[i];
                    let oldChar = lastTextContent[i];
                    if (newChar.toLowerCase() != oldChar.toLowerCase() && oldChar.toLowerCase() != oldChar.toUpperCase()) {
                        onInput(i, null);
                        updated = true;
                        break;
                    }
                }
                textareaRef.current!.setAttribute('cursorposition', (lastCursorPosition - 1).toString());
                if (!updated) {
                    setReplacements(replacements); // Force a state update otherwise the cursor goes nuts
                }
            } else {
                let updated = false;
                // This is an input
                for(let i = 0; i < event.currentTarget.value.length; i++) {
                    let newChar = event.currentTarget.value[i];
                    let oldChar = lastTextContent[i];
                    if (newChar.toLowerCase() != oldChar.toLowerCase() && oldChar.toLowerCase() != oldChar.toUpperCase()) {
                        onInput(i, newChar);
                        updated = true;
                        break;
                    }
                }
                textareaRef.current!.setAttribute('cursorposition', (lastCursorPosition + 1).toString());
                if (!updated) {
                    setReplacements(replacements); // Force a state update otherwise the cursor goes nuts
                }
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
                onKeyDown={handleKeyDown} onInput={handleInput} onChange={() => {}}
                autoCapitalize="off" autoComplete="off" spellCheck="false" autoCorrect="off"></textarea>
            <pre className={styles.decoderOutput}>{newText}</pre>
        </div>
    )
}
