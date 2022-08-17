import styles from './Highlighter.module.css'


interface HighlighterProps {
    original: string,
    modified: string,
    cursorPosition: number
}

export const Highlighter = (props: HighlighterProps) => {
    let elements: JSX.Element[] = [];

    for(let i = 0; i < props.modified.length; i++) {
        let classes = [];

        if (i == props.cursorPosition) {
            classes.push(styles.cursor);
        }

        if(props.modified[i] != props.original[i]) {
            classes.push(styles.replaced);
        }

        elements.push(<span key={i} className={classes.join(' ')}>{props.modified[i]}</span>)
    }

    return (
        <pre className={styles.highlighter}>{elements}</pre>
    )
}