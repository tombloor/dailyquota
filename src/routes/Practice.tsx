import { useState, useEffect } from "react";
import { TypeoverDecoder } from '../components/TypeoverDecoder';

import { getRandomQuote } from '../api/quoteAPI';


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

export default function Practice(props: any) {

    const [decodedQuote, setDecodedQuote] = useState('');
    const [challenge, setChallenge] = useState({
        quote: '',
        author: '',
        year: 0,
        encrypted: '',
        isLoading: true
    });

    useEffect(() => {
        const demoCipher = 'abcdefghijklmnopqrstuvwxyz'.split('').sort(() => { return 0.5 - Math.random() }).join('');
        getRandomQuote().then((q) => {
            setChallenge({
                quote: q.text,
                author: q.author,
                year: q.year,
                encrypted: applyCipher(q.text, demoCipher),
                isLoading: false
            });
        });
    }, [])

    const handleCheckSolution = () => {
        if (decodedQuote == challenge.quote) {
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

        {challenge.isLoading ? 
            <p>Loading...</p> : 
            <>
                <TypeoverDecoder originalText={challenge.encrypted} onChange={(newText: string) => { setDecodedQuote(newText); }} />
                <i>{challenge.author} { challenge.year ? <> - {challenge.year}</> : <></>}</i>
                <button onClick={handleCheckSolution} style={{marginTop: '20px'}}>Check solution</button>
            </>
        }
    </>
    )
}