import { initializeApp } from 'firebase/app'
import { getAuth, RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth'

// Firebase Console → Project Settings → General → scroll to "Your apps" →
// the web app you added → copy this whole object from there.
const firebaseConfig = {
  apiKey: 'PASTE_YOUR_API_KEY',
  authDomain: 'vaishali-saree.firebaseapp.com',
  projectId: 'vaishali-saree',
  storageBucket: 'vaishali-saree.appspot.com',
  messagingSenderId: 'PASTE_YOUR_SENDER_ID',
  appId: 'PASTE_YOUR_APP_ID',
}

const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)

export const setupRecaptcha = (containerId) => {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
    })
  }
  return window.recaptchaVerifier
}

export const sendOtp = (phone, containerId) => {
  const verifier = setupRecaptcha(containerId)
  return signInWithPhoneNumber(auth, phone, verifier)
}
