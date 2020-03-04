import firebase from 'firebase'
import 'firebase/database'

const firebaseApp = firebase.initializeApp({
    apiKey: 'AIzaSyC-ZtO_OPhu5Dq8_lZrzCZ6t01X-8Kj4Fg',
    projectId: 'escapade-69098'
})

const db = firebaseApp.firestore()

db.enablePersistence()
  .catch(function(err) {
      if (err.code == 'failed-precondition') {
          // Multiple tabs open, persistence can only be enabled
          // in one tab at a a time.
          // ...
      } else if (err.code == 'unimplemented') {
          // The current browser does not support all of the
          // features required to enable persistence
          // ...
      }
  });

export {db};