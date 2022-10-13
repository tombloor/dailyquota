import * as functions from "firebase-functions";
import { Challenge } from "./models";
import { getRandomQuote } from './services/quotable'
import * as data from './services/data'

const generateRandomCipher = () => {
    const cipher = 'abcdefghijklmnopqrstuvwxyz'.split('').sort(() => { return 0.5 - Math.random() }).join('');
    return cipher;
}

const applyCipher = (text: string, cipher:string) => {
    let tmp = '';

    text.split('').forEach((char, index) => {
        if (char.toLowerCase() != char.toUpperCase()) {
            // This is an alpha character
            const cipherIndex = char.toLowerCase().charCodeAt(0) - 'a'.charCodeAt(0);
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

const getCorrectCharacters = (original: string, modified: string): number[] => {
    const result: number[] = []
    for (let i = 0; i < original.length; i++) {
        if (original[i] === modified[i]) {
            result.push(i);
        }
    }

    return result;
}

export const requestChallenge = functions.https.onCall(async (params, context) => {
    // context.app will be undefined if the request doesn't include an
    // App Check token. (If the request includes an invalid App Check
    // token, the request will be rejected with HTTP error 401.)
    if (context.app == undefined && !process.env.FUNCTIONS_EMULATOR) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'The function must be called from an App Check verified app.')
    }

    const quote = await getRandomQuote();
    if (quote) {
        await data.saveQuote(quote);

        const cipher = generateRandomCipher();
        const encoded = applyCipher(quote.text, cipher);

        const newChallenge: Challenge = await data.createChallenge(quote, cipher, encoded);

        functions.logger.info(newChallenge);

        return {
            challenge_id: newChallenge.id,
            encoded: newChallenge.encoded,
            author: quote.author?.name,
            correctCharacters: getCorrectCharacters(quote.text, newChallenge.encoded)
        }
    } 
    return {};
});

interface checkSolutionArgs {
    challenge_id: string,
    decoded_text: string
}

export const checkSolution = functions.https.onCall(async (params: checkSolutionArgs, context) => {
    if (context.app == undefined && !process.env.FUNCTIONS_EMULATOR) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'The function must be called from an App Check verified app.')
    }
    
    const { challenge_id, decoded_text } = params;

    const c = await data.getChallenge(challenge_id);

    console.log(decoded_text);
    console.dir(c);

    if (c && c.original == decoded_text) {
        const q = await data.getQuote(c.quote_id);
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
        correct: false,
        correctCharacters: c ? getCorrectCharacters(c.original, decoded_text) : []
    }
});