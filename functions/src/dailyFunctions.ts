import * as functions from "firebase-functions";
import { requestNewChallenge, createDailyChallenge } from "./services/challenge";

export const forceNewDailyChallenge = functions.https.onRequest(async (req, resp): Promise<any> => {
    if (process.env.FUNCTIONS_EMULATOR)
    {
        functions.logger.info('Creating new daily challenge');
    
        let challenge = await requestNewChallenge();
            
        functions.logger.info(challenge);

        let startDate = new Date();
    
        if (challenge?.id)
        {
            let daily = await createDailyChallenge(challenge.id, startDate);
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

        let challenge = await requestNewChallenge();
            
        functions.logger.info(challenge);

        let startDate = new Date();
    
        if (challenge?.id)
        {
            let daily = await createDailyChallenge(challenge.id, startDate);
            functions.logger.info(daily);

            return true;
        }

        return false;
    }
);