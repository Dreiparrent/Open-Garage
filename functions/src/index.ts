import * as functions from 'firebase-functions';
import { IProfile } from '../../src/app/shared/community/community-interfaces';
// tslint:disable-next-line:no-implicit-dependencies
import { DocumentReference } from '@firebase/firestore-types';

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const userUpdate = functions.firestore.document('users/{userId}/userData/profile').onUpdate((change, context) => {
    const prevVal: IProfile = <any>change.before.data();
    const newVal: IProfile = <any>change.after.data();
    console.log(prevVal);
    console.log(newVal);
    // (prevVal.location as DocumentReference).get()
    // return change.after.ref.update({})
});