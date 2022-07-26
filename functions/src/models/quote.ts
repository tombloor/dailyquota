export interface Quote { 
    id: string,
    text: string,
    author: Author | null,
}

export interface Author {
    name: string, 
    bio: string, 
    link: string
}