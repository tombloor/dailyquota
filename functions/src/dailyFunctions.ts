import * as functions from "firebase-functions";
import { requestNewChallenge, createDailyChallenge } from "./services/challenge";

export const startNewDailyChallenge = functions.pubsub.schedule('0 7 * * *')
    .timeZone("America/Chicago")
    .onRun(async (context) => 
    {
        functions.logger.info('Creating new daily challenge');

        let challenge = await requestNewChallenge();
            
        functions.logger.info(challenge);

        if (challenge?.id)
        {
            let daily = await createDailyChallenge(challenge.id, new Date());

            if (daily) {
                // Update config for current challenge to be this id
            }
        }
    }
);