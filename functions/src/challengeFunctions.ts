import * as functions from "firebase-functions";
import { Challenge } from "./models";
import { getRandomQuote } from './services/quotable'
import * as data from './services/data'

const generateRandomCipher = (min_hints?: number, max_hints?: number) => {
    //TODO: Implement hints, will be represented by capital letters in the cipher
    // These will be automatically filled in and locked for the user to make it easier
    let cipher = 'abcdefghijklmnopqrstuvwxyz'.split('').sort(() => { return 0.5 - Math.random() }).join('');
    return cipher;
}

const applyCipher = (text: string, cipher:string) => {
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

export const requestChallenge = functions.https.onCall(async (params, context) => {
    let quote = await getRandomQuote();
    if (quote) {
        await data.saveQuote(quote);

        let cipher = generateRandomCipher();
        let encoded = applyCipher(quote.text, cipher);

        let newChallenge: Challenge = await data.createChallenge(quote, cipher, encoded);

        functions.logger.info(newChallenge);

        return {
            challenge_id: newChallenge.id,
            encoded: newChallenge.encoded,
            author: quote.author?.name
        }
    } 
    return {};
});

interface checkSolutionArgs {
    challenge_id: string,
    decoded_text: string
}

export const checkSolution = functions.https.onCall(async (params: checkSolutionArgs, context) => {
    let { challenge_id, decoded_text } = params;

    let c = await data.getChallenge(challenge_id);

    console.log(decoded_text);
    console.dir(c);

    if (c && c.original == decoded_text) {
        let q = await data.getQuote(c.quote_id);
        console.dir(q);
        if (q) {
            return {
                correct: true,
                quote: {
                    text: q.text,
                    author: q.author
                }
            }
        }
    }

    return {
        correct: false
    }
});