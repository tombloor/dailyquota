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

export const newChallenge = functions.https.onRequest(async (req, res) => {
    let quote = await getRandomQuote();
    if (quote) {
        data.createQuote(quote);

        let cipher = generateRandomCipher();
        let encoded = applyCipher(quote.text, cipher);

        let newChallenge: Challenge = data.createChallenge(quote, cipher, encoded);

        functions.logger.info(newChallenge);

        res.status(200).json({
            challenge_id: newChallenge.id,
            encoded: newChallenge.encoded
        });
    }    
});