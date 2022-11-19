import * as functions from "firebase-functions";
import { requestNewChallenge, createDailyChallenge, getCorrectCharacters } from "./services/challenge";
import { getChallenge, getDaily } from "./services/data";

export const forceNewDailyChallenge = functions.https.onRequest(async (req, resp): Promise<any> => {
    if (process.env.FUNCTIONS_EMULATOR)
    {
        functions.logger.info('Creating new daily challenge');
    
        const challenge = await requestNewChallenge();
            
        functions.logger.info(challenge);

        const startDate = new Date();
    
        if (challenge?.id)
        {
            const daily = await createDailyChallenge(challenge.id, startDate);
            functions.logger.info(daily);

            return resp.end('ok');
        }

        return resp.end('fail');
    }

    return resp.end('Not Allowed');
});

export const startNewDailyChallenge = functions.pubsub.schedule('0 7 * * *')
    .onRun(async (context) => 
    {
        functions.logger.info('Creating new daily challenge');

        const startDate = new Date();

        if (await getDaily(startDate) == null) {
            const challenge = await requestNewChallenge();
                
            functions.logger.info(challenge);
    
            if (challenge?.id)
            {
                const daily = await createDailyChallenge(challenge.id, startDate);
                functions.logger.info(daily);
    
                return true;
            }
        } else {
            functions.logger.warn('Todays challenge has already been generated');
        }

        return false;
    }
);

export const getCurrentDailyChallenge = functions.https.onCall(async (params, context) => {
    if (context.app == undefined && !process.env.FUNCTIONS_EMULATOR) {
        throw new functions.https.HttpsError(
            'failed-precondition',
            'The function must be called from an App Check verified app.')
    }

    const now = new Date();
    const daily = await getDaily(now);

    if (daily) {
        let resp: any = {
            startsIn: 0,
            endsIn: 0,
            challenge_id: null,
            author: null,
            encoded: null,
            correctCharacters: null
        }

        if (now < daily.start) {
            resp.startsIn = daily.start.getTime() - now.getTime();
        } else if (now > daily.end) {
            resp.endsIn = daily.end.getTime() - now.getTime();
        } else if (daily.challenge_id) {
            const challenge = await getChallenge(daily.challenge_id);

            if (challenge) {
                resp.challenge_id = challenge.id;
                resp.encoded = challenge.encoded;
                resp.author = challenge.author;
                resp.correctCharacters = getCorrectCharacters(challenge.original, challenge.encoded);
            } else {
                functions.logger.error('Daily is missing a challenge');
                return new functions.https.HttpsError('internal', 'Daily challenge is invalid');
            }
        }
        
        return resp;
    }

    return new functions.https.HttpsError('not-found', 'No daily challenge could be found for the specified date');
})