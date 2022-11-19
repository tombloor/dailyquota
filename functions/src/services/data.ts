import { db } from './firebase';
import { Challenge, Quote, Daily } from '../models'

// Checkout the docs on firestore converters for a nice way to map interfaces 

export const getQuote = async (id: string): Promise<Quote | null> => {
    const quoteDoc = await db.doc('quotes/' + id).get();
    const q = quoteDoc.data();

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
    const quoteDoc = {...quote};
    await db.collection('quotes').doc(quoteDoc.id).set({
        text: quoteDoc.text,
        author: quoteDoc.author
    });

    return quoteDoc;
};

export const getChallenge = async (id: string): Promise<Challenge | null> => {
    const challengeDoc = await db.doc('challenges/' + id).get();
    const c = challengeDoc.data();

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
    const challengeCollection = db.collection('challenges');
    const challengeDoc: Challenge = {
        quote_id: quote.id,
        cipher,
        original: quote.text,
        encoded,
        author: quote.author?.name ?? "",
        created_on: new Date()
    };

    const result = await challengeCollection.add(challengeDoc);
    challengeDoc.id = result.id;

    return challengeDoc;
};

export const getDaily = async (date: Date): Promise<Daily | null> => {
    const year = date.toLocaleString("default", { year: "numeric" });
    const month = date.toLocaleString("default", { month: "2-digit" });
    const day = date.toLocaleString("default", { day: "2-digit" });
    
    const id = 'daily-' + year + month + day;

    const dailyDoc = await db.doc('daily/' + id).get();
    const data = dailyDoc.data();

    if (data) {
        return {
            id: id,
            start: data.start,
            end: data.end,
            challenge_id: data.challenge_id
        }
    }

    return null;
}

export const createDaily = async (challenge_id: string, start: Date, end: Date): Promise<Daily> => {
    const dailyCollection = db.collection('daily');
    
    const year = start.toLocaleString("default", { year: "numeric" });
    const month = start.toLocaleString("default", { month: "2-digit" });
    const day = start.toLocaleString("default", { day: "2-digit" });
    
    const newId = 'daily-' + year + month + day;
    
    const dailyDoc: Daily = {
        id: newId,
        challenge_id: challenge_id,
        start: start,
        end: end
    };

    await dailyCollection.doc(newId).set(dailyDoc);

    return dailyDoc;
};