import { functions } from '../services/firebase';
import { httpsCallable } from 'firebase/functions';

export const createChallenge = httpsCallable<unknown, {challenge_id: string, encoded: string, author: string}>(functions, "requestChallenge");