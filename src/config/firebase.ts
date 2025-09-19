import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'
import { getFunctions } from 'firebase/functions'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDhcDjDvKd6Iz2hGcTg8eN0v0dveF_DwOg",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "ai-chatbot-c0bed.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "ai-chatbot-c0bed",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "ai-chatbot-c0bed.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "919555208445",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:919555208445:web:87f842a88ed8adb7703a94",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-3WEES65TVJ"
}

export const app = initializeApp(firebaseConfig)
export const analytics = getAnalytics(app)
export const db = getFirestore(app)
export const storage = getStorage(app)
export const functions = getFunctions(app)