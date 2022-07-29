import { Challenge, Quote } from '../models'

// Checkout the docs on firestore converters for a nice way to map interfaces 

export const saveQuote = (quote: Quote): Quote => {
    let id = 'TODO: SAVE IN FIRESTORE'; // This should be a hash of the normalised quote text and the source (quotable::this is the quote)

    return {
        ...quote,
        id
    }
};

export const createChallenge = (quote: Quote, cipher: string, encoded: string): Challenge => {
    let id = 'TODO: SAVE IN FIRESTORE'; // For daily challenges this could be the date? For practices just a guid (these will be separate collections)

    return {
        id,
        quote_id: quote.id,
        cipher,
        original: quote.text,
        encoded,
        author: quote.author?.name ?? "",
        created_on: new Date()
    }
}