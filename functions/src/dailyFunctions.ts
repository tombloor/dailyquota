import * as functions from "firebase-functions";
import { requestNewChallenge, createDailyChallenge } from "./services/challenge";
import { getDaily } from "./services/data";

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