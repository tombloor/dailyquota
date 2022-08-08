import { functions } from '../services';
import { httpsCallable } from 'firebase/functions';

export const createChallenge = httpsCallable<null, {challenge_id: string, encoded: string, author: string}>(functions, "requestChallenge");

export const checkSolution = httpsCallable<{challenge_id: string, decoded_text: string}, any>(functions, "checkSolution");