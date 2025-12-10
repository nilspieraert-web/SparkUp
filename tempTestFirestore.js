const { initializeApp } = require('firebase/app');
const { getFirestore, addDoc, collection, serverTimestamp } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: 'JOUW_API_KEY',
  authDomain: 'jouw-project.firebaseapp.com',
  projectId: 'jouw-project-id',
  storageBucket: 'jouw-project-id.appspot.com',
  messagingSenderId: 'JOUW_SENDER_ID',
  appId: 'JOUW_APP_ID',
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
(async () => {
  try {
    const ref = await addDoc(collection(db, 'games'), { title: 'Test', createdAt: serverTimestamp() });
    console.log('Success', ref.id);
  } catch (err) {
    console.error('Error', err);
  }
})();
