import { useState } from "react"
import { DecoderItem } from "./DecoderItem";


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

    let items = [];
    for(let i = 0; i < cipher.length; i++)
    {
        let orig = String.fromCharCode(lowerCaseBounds + i);
        let isLocked = cipher.charCodeAt(i) < lowerCaseBounds;
        items.push(
            <DecoderItem key={i} originalLetter={orig} newLetter={cipher[i]} 
                         locked={isLocked} handleChange={handleItemChange} />
        );
    }

    return (
        <div style={{'display': 'flex', 'flexDirection': 'row'}}>
            {items}
        </div>
    )
}