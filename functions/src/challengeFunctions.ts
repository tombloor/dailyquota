import * as functions from "firebase-functions";
import { requestNewChallenge } from "./services/challenge";
import * as data from "./services/data";

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

    let challenge = await requestNewChallenge();
        
    functions.logger.info(challenge);

    if (challenge)
    {
        return {
            challenge_id: challenge.id,
            encoded: challenge.encoded,
            author: challenge.author,
            correctCharacters: getCorrectCharacters(challenge.original, challenge.encoded)
        }
    }
    
    throw new functions.https.HttpsError('internal', 'No challenge was created');
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