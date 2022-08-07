import { logger } from 'firebase-functions'
import { Quote, Author } from '../models';
import axios from 'axios';
import { createHash } from 'crypto';


export const getQuoteId = (author: string, text: string): string => {
    let author_text = author.toLowerCase().trim() + '::' + text.toLowerCase().trim();
    let hash = createHash('md5').update(author_text).digest('base64url');
    return hash;
}

export const getAuthor = (slug: string): Promise<Author | null> => {
    console.log('slug is : ' + slug);
    let url = 'https://api.quotable.io/authors?slug=' + slug;

    return axios.get(url)
        .then((response) => {
            return response.data.results[0]
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
    let url = 'https://api.quotable.io/random?maxLength=50';
    return axios.get(url)
        .then((response) => {
            return response.data;
        })
        .then(async (data) => {
            let author = await getAuthor(data.authorSlug);
            let quote: Quote = {
                id: getQuoteId(data.content, author?.name ?? ""),
                text: data.content,
                author: author
            }
            return quote;
        })
}