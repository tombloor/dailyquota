import { useState, useEffect } from "react";
import { TypeoverDecoder } from '../components/TypeoverDecoder';

import { createChallenge, checkSolution } from '../api/challengeAPI';


export default function Practice(props: any) {

    const [decodedQuote, setDecodedQuote] = useState('');
    const [challenge, setChallenge] = useState<{
        challenge_id: string,
        author: string,
        encoded: string
    }>();

    useEffect(() => {
        const demoCipher = 'abcdefghijklmnopqrstuvwxyz'.split('').sort(() => { return 0.5 - Math.random() }).join('');
        // Check if challenge saved in storage
            // If yes, set state so the user can pick up where they left off
            // If no, request a new challenge
    }, [])

    const handleCheckSolution = () => {
        if (challenge) {
            let request = {
                challenge_id: challenge.challenge_id, 
                decoded_text: decodedQuote
            };
            checkSolution(request).then((response: any) => {
                console.dir(response.data);
                alert(response.data.correct);
            });
        }
    }

    const startNewChallenge = async () => {
        let { challenge_id, encoded, author } = (await createChallenge()).data;

        setChallenge({
            challenge_id,
            encoded,
            author
        });
    }

    return (
    <>
        <h2>Practice Page</h2>
        <p>
            Right now this is just a demo of how the letter replacement will work. Try changing the letters to make
            the text match.
        </p>

        { !challenge ?
            <button onClick={startNewChallenge}>Start a new challenge</button> :
            <>
                <TypeoverDecoder originalText={challenge.encoded} onChange={(newText: string) => { setDecodedQuote(newText); }} />
                <i>{challenge.author}</i>
                <button onClick={handleCheckSolution} style={{marginTop: '20px'}}>Check solution</button>
            </>
        }       
    </>
    )
}