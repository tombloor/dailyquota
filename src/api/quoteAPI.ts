import { db } from '../services';
import { collection, doc, getDoc, DocumentData, getDocs } from 'firebase/firestore';

export interface quoteInterface { 
    id: string,
    reference: string,
    text: string,
    author: string,
    bio: string,
    moreInfoUrl: string
}

export const getQuote = async (id: string) => {
    const quoteDoc = doc(db, 'quotes/' + id);
    let snapshot = await getDoc<DocumentData>(quoteDoc);
    return { id: id, ...snapshot.data() } as quoteInterface;
}

export const getRandomQuote = async () => {
    let querySnapshot = await getDocs(collection(db, "quotes"));
    let r = Math.floor(Math.random() * querySnapshot.size)

    let selectedDoc = querySnapshot.docs[r];
    return { id: selectedDoc.id, ...selectedDoc.data() } as quoteInterface;
}