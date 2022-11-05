import * as functions from "firebase-functions";
import { requestNewChallenge, createDailyChallenge } from "./services/challenge";

export const startNewDailyChallenge = functions.pubsub.schedule('0 4 * * *')
    .timeZone("America/Chicago")
    .onRun(async (context) => 
    {
        functions.logger.info('Creating new daily challenge');

        let challenge = await requestNewChallenge();
            
        functions.logger.info(challenge);

        if (challenge?.id)
        {
            let daily = await createDailyChallenge(challenge.id, new Date());
            functions.logger.info(daily);
        }
    }
);