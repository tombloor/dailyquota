import { db } from './firebase';
import { Challenge, Quote } from '../models'

// Checkout the docs on firestore converters for a nice way to map interfaces 

export const getQuote = async (id: string): Promise<Quote | null> => {
    let quoteDoc = await db.doc('quotes/' + id).get();
    let q = quoteDoc.data();

    if (q) {
        return {
            id,
            text: q.text,
            author: q.author
        }
    }
    
    return null;
}

export const saveQuote = async (quote: Quote): Promise<Quote> => {
    let quoteDoc = {...quote};
    await db.collection('quotes').doc(quoteDoc.id).set({
        text: quoteDoc.text,
        author: quoteDoc.author
    });

    return quoteDoc;
};

export const getChallenge = async (id: string): Promise<Challenge | null> => {
    let challengeDoc = await db.doc('challenges/' + id).get();
    let c = challengeDoc.data();

    if (c) {
        return {
            id: c.id,
            quote_id: c.quote_id,
            cipher: c.cipher,
            original: c.original,
            encoded: c.encoded,
            author: c.author,
            created_on: c.created_on
        }
    }
    
    return null;
}

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
};