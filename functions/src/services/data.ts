import { db } from './firebase';
import { Challenge, Quote } from '../models'

// Checkout the docs on firestore converters for a nice way to map interfaces 

export const saveQuote = async (quote: Quote): Promise<Quote> => {
    let quoteCollection = db.collection('quotes');
    let quoteDoc = {...quote};
    await quoteCollection.add(quoteDoc);

    return quoteDoc;
};

export const createChallenge = async (quote: Quote, cipher: string, encoded: string): Promise<Challenge> => {
    let challengeCollection = db.collection('challenges');
    let challengeDoc: Challenge = {
        quote_id: quote.id,
        cipher,
        original: quote.text,
        encoded,
        author: quote.author?.name ?? "",
        created_on: new Date()
    };

    let result = await challengeCollection.add(challengeDoc);
    challengeDoc.id = result.id;

    return challengeDoc;
}