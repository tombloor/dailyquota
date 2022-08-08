

export interface Challenge {
    id?: string,
    quote_id: string,
    cipher: string,
    original: string,
    encoded: string,
    author: string,
    created_on: Date
}