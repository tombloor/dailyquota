import { getRandomQuote } from './quotable'
import * as data from './data'
import { Challenge, Daily } from '../models';
 
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

export const getCorrectCharacters = (original: string, modified: string): number[] => {
    const result: number[] = []
    for (let i = 0; i < original.length; i++) {
        if (original[i] === modified[i]) {
            result.push(i);
        }
    }

    return result;
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

export const createDailyChallenge = async (challenge_id: string, now: Date): Promise<Daily | null> => {
    const start =  new Date(now.getTime());
    start.setHours(13, 0, 0, 0);

    const end = new Date(start.getTime());
    end.setDate(end.getDate() + 1);
    end.setHours(5, 0, 0, 0);

    const daily = await data.createDaily(challenge_id, start, end);

    return daily;
}
