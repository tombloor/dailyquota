import { EventBusyTwoTone } from '@mui/icons-material';
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
                    // TODO: respect casing
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
        return textareaRef.current!.selectionStart;
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
            if (character) 
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

    const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if(event.code.startsWith('Arrow')) return;

        event.preventDefault();

        let cursorPosition = getCursorPosition();

        if (event.code.startsWith('Key')) {
            onInput(cursorPosition, event.key);
            moveCursor(cursorPosition + 1);
        }
        else if (event.code === 'Delete')
        {
            onInput(cursorPosition, null);
        }
        else if (event.code === 'Backspace')
        {
            if (cursorPosition > 0)
            {
                onInput(cursorPosition - 1, null);
            }
            moveCursor(cursorPosition - 1);
        }
        else if (event.code === 'Space')
        {
            moveCursor(cursorPosition + 1);
        }
    }

    return (
        <div className={styles.decoderContainer}>
            <textarea ref={textareaRef} className={styles.decoderInput} spellCheck={false} onKeyDown={handleKeyDown} value={originalText}></textarea>
            <pre className={styles.decoderOutput}>{newText}</pre>
        </div>
    )
}
