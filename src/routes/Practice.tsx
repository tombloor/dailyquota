import { useState, useEffect } from "react";
import { ReplacementMap, TypeoverDecoder } from '../components/TypeoverDecoder';

import { createChallenge, checkSolution } from '../api/challengeAPI';


export default function Practice(props: any) {

    const [decodedQuote, setDecodedQuote] = useState('');
    const [replacements, setReplacements] = useState<ReplacementMap | null>();
    const [challenge, setChallenge] = useState<{
        challenge_id: string,
        author: string,
        encoded: string
    } | null>();

    useEffect(() => {
        let storedChallenge = JSON.parse(localStorage.getItem("challenge") ?? "{}");
        
        if (storedChallenge && storedChallenge.encoded) {
            const storedDecoded = localStorage.getItem("decoded") ?? storedChallenge.encoded;
            const storedReplacements = localStorage.getItem("replacements") ?? "{}";

            setDecodedQuote(storedDecoded);
            setReplacements(JSON.parse(storedReplacements));
            setChallenge(storedChallenge);
        } else {
            startNewChallenge();
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("challenge", JSON.stringify(challenge));
    }, [challenge]);    

    useEffect(() => {
        localStorage.setItem("replacements", JSON.stringify(replacements));

        if (replacements) {
            let replacedText = "";
            challenge?.encoded.split('').forEach(char => {
                if(char.toLowerCase() in replacements) {
                    let replacement = replacements[char.toLowerCase()];
                    if(char === char.toUpperCase()) {
                        replacedText += replacement.toUpperCase();
                    } else {
                        replacedText += replacement.toLowerCase();
                    }
                } else {
                    replacedText += char;
                }
            });
            localStorage.setItem("decoded", replacedText);
        } else {
            localStorage.setItem("decoded", challenge?.encoded ?? "");
        }

    }, [replacements]);    

    const handleCheckSolution = () => {
        if (challenge) {
            let request = {
                challenge_id: challenge.challenge_id, 
                decoded_text: decodedQuote
            };
            checkSolution(request).then((response: any) => {
                console.dir(response.data);
                if (response.data.correct) {
                    alert("Well Done! 🎊 Try another one");
                    startNewChallenge();
                } else {
                    alert("Not quite... Try again");
                }
            });
        }
    }

    const handleGiveUp = () => {
        setChallenge(null);
        setDecodedQuote('');
    }

    const handleTextChange = (newText: string, newReplacements: ReplacementMap) => {
        setDecodedQuote(newText);
        setReplacements(newReplacements);
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
                <TypeoverDecoder originalText={challenge.encoded} onChange={handleTextChange} />
                <i>{challenge.author}</i>
                <button onClick={handleCheckSolution} style={{marginTop: '20px'}}>Check solution</button>
                <button onClick={handleGiveUp} style={{marginTop: '20px'}}>Give Up</button>
            </>
        }       
    </>
    )
}