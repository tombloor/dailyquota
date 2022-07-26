import { logger } from 'firebase-functions'
import { Quote, Author } from '../models';
import axios from 'axios';


export const getAuthor = (slug: string): Promise<Author | null> => {
    let url = 'https://api.quotable.io/authors?slug=' + slug;

    return axios.get(url)
        .then((response) => {
            return response.data
        })
        .then((data) => {
            const { name, bio, link } = data;
            return {
                name,
                bio,
                link
            }
        })
        .catch((error) => {
            logger.error(error);
            return null;
        });
}

export const getRandomQuote = (): Promise<Quote | null> => {
    let url = 'https://api.quotable.io/random';
    return axios.get(url)
        .then((response) => {
            return response.data;
        })
        .then(async (data) => {
            let quote: Quote = {
                id: 'quotable_' + data._id,
                text: data.content,
                author: await getAuthor(data.authorSlug) 
            }
            return quote;
        })
}