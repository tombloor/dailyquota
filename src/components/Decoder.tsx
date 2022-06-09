import { ReactElement, useState } from "react"
import { DecoderItem } from "./DecoderItem";

import styles from './Decoder.module.css';


type DecoderProps = {
    cipher: string,
    onChange: (newCipher:string) => void
}

export function Decoder(props: DecoderProps) {
    const lowerCaseBounds = 97

    const [cipher, setCipher] = useState(props.cipher);

    const handleItemChange = (originalLetter: string, newLetter: string) => {
        let cipherIndex = originalLetter.charCodeAt(0) - lowerCaseBounds;
        let newCipher = cipher.substring(0, cipherIndex);
        newCipher += newLetter.toLowerCase();
        newCipher += cipher.substring(cipherIndex + 1, cipher.length);

        setCipher(newCipher);
        props.onChange(newCipher);
    }

    let items: {[key: string]: ReactElement} = {};
    for(let i = 0; i < cipher.length; i++)
    {
        let orig = String.fromCharCode(lowerCaseBounds + i);
        let isLocked = cipher.charCodeAt(i) < lowerCaseBounds;
        items[orig] = (
            <DecoderItem key={i} index={i} originalLetter={orig} newLetter={cipher[i]} 
                         locked={isLocked} handleChange={handleItemChange} />
        );
    }

    let topRow = 'qwertyuiop'.split('');
    let middleRow = 'asdfghjkl'.split('');
    let bottomRow = 'zxcvbnm'.split('');

    return (
        <div className={styles.decoderContainer}>
            <div className={styles.row}>
                {topRow.map((key, index) => {
                    return items[key];
                })}
            </div>
            <div className={styles.row}>
                {middleRow.map((key, index) => {
                    return items[key];
                })}
            </div>
            <div className={styles.row}>
                {bottomRow.map((key, index) => {
                    return items[key];
                })}
            </div>
        </div>
    )
}