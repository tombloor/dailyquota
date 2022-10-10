import { CharacterState } from '../shared/utilities';
import styles from './Highlighter.module.css'


interface HighlighterProps {
    text: string,
    cursorPosition: number,
    characterStates: CharacterState[]
}

export const Highlighter = (props: HighlighterProps) => {
    let elements: JSX.Element[] = [];

    for(let i = 0; i < props.text.length; i++) {
        let classes = [];

        if (i == props.cursorPosition) {
            classes.push(styles.cursor);
        }

        switch (props.characterStates[i]) {
            case CharacterState.Replaced:
                classes.push(styles.replaced);
                break;
            case CharacterState.Correct:
                classes.push(styles.correct);
                break;
        }

        elements.push(<span key={i} className={classes.join(' ')}>{props.text[i]}</span>)
    }

    return (
        <pre className={styles.highlighter}>{elements}</pre>
    )
}