import { Challenge, Quote } from '../models'


export const createQuote = (quote: Quote): Quote => {
    let id = 'TODO: SAVE IN FIRESTORE';

    return {
        ...quote,
        id
    }
};



export const createChallenge = (quote: Quote, cipher: string, encoded: string): Challenge => {
    let id = 'TODO: SAVE IN FIRESTORE';

    return {
        id,
        quote_id: quote.id,
        cipher,
        original: quote.text,
        encoded,
        created_on: new Date()
    }
}