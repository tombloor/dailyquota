import { useState } from "react";
import { Decoder } from "../components/Decoder";

const data = {
    'quote': 'Welcome to the Daily Quota demo!',
    'cipher': 'abcdefghijklmnopqrstuvwxyz' // Users attempt (will be state eventually)
    , 'encrypted': ''
}

const applyCipher = (text: string, cipher: string) => {
    let tmp = '';

    text.split('').forEach((char, index) => {
        if (char.toLowerCase() != char.toUpperCase()) {
            // This is an alpha character
            let cipherIndex = char.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
            if (char.toLowerCase() == char) {
                tmp += cipher[cipherIndex];
            } else {
                tmp += cipher[cipherIndex].toUpperCase();
            }
        } else {
            tmp += char;
        }
    });

    return tmp;
}

// This is just for the demo
const demoCipher = data.cipher.split('').sort(() => { return 0.5 - Math.random() }).join('');
data.encrypted = applyCipher(data.quote, demoCipher);
//

export default function Practice(props: any) {

    const [decodedQuote, setDecodedQuote] = useState(data.encrypted);
    const [cipher, setCipher] = useState(data.cipher);

    const handleCipherChange = (newCipher: string) => {
        setCipher(newCipher);
        setDecodedQuote(applyCipher(data.encrypted, newCipher));
    }

    const handleCheckSolution = () => {
        if (decodedQuote == data.quote) {
            alert('Success! 🎊');
        } else {
            alert('Not quite! 🙅');
        }
    }

    return (
    <>
        <h2>Practice Page</h2>
        <p>
            Right now this is just a demo of how the letter replacement will work. Try changing the letters to make
            the text match.
        </p>
        {/* <p>Decoded quote: {data.quote}</p>
        <p>Encoded quote: {data.encrypted}</p> */}
        <p>{decodedQuote}</p>
        <Decoder cipher={cipher} onChange={handleCipherChange} onSubmit={handleCheckSolution} />
    </>
    )
}