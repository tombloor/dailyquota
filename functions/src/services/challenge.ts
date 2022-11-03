import { getRandomQuote } from './quotable'
import * as data from './data'
import { Challenge } from '../models/challenge';
 
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

export const requestNewChallenge = async (): Promise<Challenge | null> => {
    const quote = await getRandomQuote();
    if (quote) {
        await data.saveQuote(quote);

        const cipher = generateRandomCipher();
        const encoded = applyCipher(quote.text, cipher);

        const newChallenge: Challenge = await data.createChallenge(quote, cipher, encoded);

        return newChallenge;
    }
    return null;    
}

