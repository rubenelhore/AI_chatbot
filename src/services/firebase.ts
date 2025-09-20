import { httpsCallable } from 'firebase/functions';
import { functions } from '../config/firebase';

export const processDocumentCall = httpsCallable(functions, 'processDocument');
export const chatQueryCall = httpsCallable(functions, 'chatQuery');
export const deleteDocumentCall = httpsCallable(functions, 'deleteDocument');