import styles from './Highlighter.module.css'


interface HighlighterProps {
    original: string,
    modified: string
}

export const Highlighter = (props: HighlighterProps) => {
    let elements: JSX.Element[] = [];

    let currentText = "";
    let currentClass = "";
    let key = 0;

    for(let i = 0; i < props.modified.length; i++) {
        if(props.modified[i] == props.original[i]) {
            if(currentClass == "") {
                currentText += props.modified[i];
            } else {
                if(currentText.length > 0) {
                    elements.push(<span key={key} className={currentClass}>{currentText}</span>);
                    key++;
                }
                currentText = props.modified[i];
                currentClass = "";
            }
        } else {
            if (currentClass == styles.replaced) {
                currentText += props.modified[i];
            } else {
                if(currentText.length > 0) {
                    elements.push(<span key={key} className={currentClass}>{currentText}</span>);
                    key++;
                }
                currentText = props.modified[i];
                currentClass = styles.replaced;
            }
        }
    }

    if(currentText) {
        elements.push(<span key={key} className={currentClass}>{currentText}</span>);
    }

    return (
        <pre className={styles.highlighter}>{elements}</pre>
    )
}