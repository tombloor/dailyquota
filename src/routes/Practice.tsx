import { useState, useEffect } from "react";
import { Decoder } from '../components/Decoder';

import { createChallenge, checkSolution } from '../api/challengeAPI';
import { ReplacementMap } from "../shared/interfaces/Replacement.interface";
import { runReplacements } from "../shared/utilities"


export default function Practice(props: any) {

    const [decodedQuote, setDecodedQuote] = useState('');
    const [replacements, setReplacements] = useState<ReplacementMap | null>();
    const [challenge, setChallenge] = useState<{
        challenge_id: string,
        author: string,
        encoded: string
    } | null>();
    const [loading, setLoading] = useState(false);

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
            let replacedText = runReplacements(challenge!.encoded, replacements);
            localStorage.setItem("decoded", replacedText);
            setDecodedQuote(replacedText);
        } else {
            localStorage.setItem("decoded", challenge?.encoded ?? "");
            setDecodedQuote(challenge?.encoded ?? "");
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

    // const handleTextChange = (newText: string, newReplacements: ReplacementMap) => {
    //     setDecodedQuote(newText);
    //     setReplacements(newReplacements);
    // }

    const updateCharacter = (oldChar: string, newChar: string) => {
        let rep = {
            ...replacements!
        }
        if (newChar === '') {
            delete rep[oldChar];
        } else {
            rep[oldChar] = newChar;
        } 
        setReplacements(rep);
    }

    const startNewChallenge = async () => {
        setLoading(true);

        createChallenge().then(result => {
            const { challenge_id, encoded, author } = result.data;
            setChallenge({
                challenge_id,
                encoded,
                author
            });
            setLoading(false);
        })
    }

    return (
    <>
        <h2>Practice</h2>
        { !challenge ?
            <button onClick={startNewChallenge}>Start a new challenge</button> :
            <div className="flex-column-wrapper">
                <Decoder original_text={challenge.encoded} modified_text={decodedQuote} author={challenge.author} updateCharacter={updateCharacter}></Decoder>
                <div className="buttonRow" style={{marginTop: 'auto'}}>
                    <button onClick={handleCheckSolution}>Check solution</button>
                    <button onClick={handleGiveUp}>Give Up</button>
                </div>
            </div>
        }     
        { loading && 
            <div className='loading'><p>Loading...</p></div>
        } 
    </>
    )
}