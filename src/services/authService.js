
// import { initializeApp } from 'firebase/app';
// import {
//     getAuth,
//     signInWithPopup,
//     GoogleAuthProvider,
//     createUserWithEmailAndPassword,
//     signInWithEmailAndPassword,
//     signOut,
//     onAuthStateChanged
// } from 'firebase/auth';

// const firebaseConfig = {
//     apiKey: "YOUR_API_KEY",
//     authDomain: "YOUR_AUTH_DOMAIN",
//     projectId: "YOUR_PROJECT_ID",
// };

// const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
// const googleProvider = new GoogleAuthProvider();

// const signInWithGoogle = () => signInWithPopup(auth, googleProvider);
// const signUpWithEmail = (email, password) => createUserWithEmailAndPassword(auth, email, password);
// const logInWithEmail = (email, password) => signInWithEmailAndPassword(auth, email, password);
// const logout = () => signOut(auth);
// const getCurrentUserToken = () => {
//     return auth.currentUser ? auth.currentUser.getIdToken(true) : null;
// };

// Mock implementation for testing without Firebase
const auth = {};
const onAuthStateChanged = (auth, callback) => {
    const user = {
        uid: 'test-uid',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: 'https://example.com/avatar.png'
    };
    callback(user);
    return () => {}; // Unsubscribe function
};
const signInWithGoogle = () => Promise.resolve();
const signUpWithEmail = (email, password) => Promise.resolve();
const logInWithEmail = (email, password) => Promise.resolve();
const logout = () => Promise.resolve();
const getCurrentUserToken = () => Promise.resolve('mock-jwt-token');


export {
    auth,
    onAuthStateChanged,
    signInWithGoogle,
    signUpWithEmail,
    logInWithEmail,
    logout,
    getCurrentUserToken
};
