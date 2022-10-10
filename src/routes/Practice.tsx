import { useState, useEffect } from "react";
import { Decoder } from '../components/Decoder';

import { createChallenge, checkSolution } from '../api/challengeAPI';
import { getCharacterStates, runReplacements } from "../shared/utilities"
import { GameState } from "../shared/interfaces/GameState.interface";


export default function Practice(props: any) {

    const [gameState, setGameState] = useState<GameState | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const gameStateJSON = localStorage.getItem("gameState");

        if (gameStateJSON) {
            let state = JSON.parse(gameStateJSON);
            setGameState(state);
        } 
    }, []);

    useEffect(() => {
        if (gameState) {
            localStorage.setItem('gameState', JSON.stringify(gameState));
        } else {
            localStorage.removeItem('gameState');
        }
    }, [gameState]);

    useEffect(() => {
        if (gameState) {
            let newState = {
                ...gameState
            };
    
            if (newState.challenge) {
                newState.currentText = runReplacements(newState.challenge.encoded, newState.replacements);
                newState.characterStates = getCharacterStates(newState.challenge.encoded, newState.replacements, newState.correctCharacters);
            }
    
            setGameState(newState);
        }
    }, [gameState?.replacements, gameState?.correctCharacters]);

    const handleCheckSolution = () => {
        if (gameState && gameState.challenge) {
            let request = {
                challenge_id: gameState.challenge.challenge_id,
                decoded_text: gameState.currentText
            };
            
            checkSolution(request).then((response: any) => {
                if (response.data.correct) {
                    alert("Well Done! 🎊 Try another one");
                    startNewChallenge();
                } else {
                    alert("Not quite... Try again");
                    setGameState({...gameState, correctCharacters: response.data.correctCharacters});
                }
            });
        }


        // if (challenge) {
        //     let request = {
        //         challenge_id: challenge.challenge_id, 
        //         decoded_text: decodedQuote ?? ''
        //     };
        //     checkSolution(request).then((response: any) => {
        //         console.dir(response.data);
        //         if (response.data.correct) {
        //             alert("Well Done! 🎊 Try another one");
        //             startNewChallenge();
        //         } else {
        //             alert("Not quite... Try again");
        //             setCorrect(response.data.correctCharacters);
        //         }
        //     });
        // }
    }

    const handleGiveUp = () => {
        localStorage.removeItem("gameState");
        setGameState(null);
    }

    const updateCharacter = (oldChar: string, newChar: string) => {
        if (gameState) {
            let replacements = {...gameState.replacements};
            if(newChar === '') {
                delete replacements[oldChar];
            } else {
                replacements[oldChar] = newChar;
            }

            setGameState({...gameState, replacements: replacements});
        }
    }

    const startNewChallenge = async () => {
        setLoading(true);

        createChallenge().then(result => {
            const { challenge_id, encoded, author, correctCharacters } = result.data;

            setGameState({
                ...gameState,
                challenge: { challenge_id, author, encoded },
                currentText: encoded,
                correctCharacters: correctCharacters,
                replacements: {},
                characterStates: []
            });

            setLoading(false);
        });
    }

    return (
    <>
        <h2>Practice</h2>
        { !gameState || !gameState.challenge ?
            <button onClick={startNewChallenge}>Start a new challenge</button> :
            <div className="flex-column-wrapper">
                <Decoder 
                        original_text={gameState.challenge.encoded} 
                        modified_text={gameState.currentText ?? gameState.challenge.encoded} 
                        author={gameState.challenge.author} 
                        updateCharacter={updateCharacter}
                        characterStates={gameState.characterStates}></Decoder>
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