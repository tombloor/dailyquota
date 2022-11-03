import * as functions from "firebase-functions";
import { requestNewChallenge } from "./services/challenge";

export const startNewDailyChallenge = functions.pubsub.schedule('0 7 * * *')
    .timeZone("America/Chicago")
    .onRun(async (context) => 
    {
        functions.logger.info('Creating new daily challenge');

        let challenge = await requestNewChallenge();
            
        functions.logger.info(challenge);

        // Create a new Daily entry for this challenge

        // Update config for current challenge to be this id
    }
);