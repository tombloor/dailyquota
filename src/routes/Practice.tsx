import { useState } from "react";
import { Decoder } from "../components/Decoder";

const data = {
    'quote': 'Welcome to the Daily Quota demo!',
    'cipher': 'abcdefghijklmnopqrstuvwxyz' // Users attempt (will be state eventually)
}


export default function Practice(props: any) {

    const [decodedQuote, setDecodedQuote] = useState(data.quote);

    const handleCipherChange = (newCipher: string) => {
        let tempQuote = data.quote;

        for (let i = 0; i < newCipher.length; i++) {
            let char = String.fromCharCode('a'.charCodeAt(0) + i);
            tempQuote = tempQuote.replaceAll(char.toLowerCase(), newCipher[i].toLowerCase());
            tempQuote = tempQuote.replaceAll(char.toUpperCase(), newCipher[i].toUpperCase());
        }

        setDecodedQuote(tempQuote);
    }

    return (
    <>
        <h2>Practice Page</h2>
        <p>{data.quote}</p>
        <p>{decodedQuote}</p>
        <Decoder cipher={data.cipher} onChange={handleCipherChange} />
    </>
    )
}