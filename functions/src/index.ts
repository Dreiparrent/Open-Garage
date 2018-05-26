import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
// tslint:disable-next-line:no-implicit-dependencies
import { DocumentReference, GeoPoint, CollectionReference, WriteResult } from '@google-cloud/firestore';

/* ** INTERFACES ** */
interface ITags {
    passions: string[];
    skills: string[];
    paymentForm: number[];
}
interface IProfile {
    about: string;
    email: string;
    fName: string;
    lName: string;
    location: any;
}

// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

/* ** PROFILE ** */
export const updateProfile = functions.firestore.document('users/{userId}/userData/profile').onUpdate((change, context): Promise<any> => {
    const newVal = <any>change.after.data();
    const uid = context.params.userId;
    const newName = newVal.fName + ' ' + newVal.lName;
    // const location: string = <any>newVal['location']; add this

    return change.after.ref.set(newVal, { merge: true }).then(result => {
        return admin.firestore().collection('users').doc(uid).set({
            name: newName
        }, {merge: true});
    });
});

/* ** TAGS ** */
export const addTag = (user: string, update: { ref: DocumentReference }, tag: string, isSkill = false): Promise<any> => {
    const collection = isSkill ? 'skills' : 'passions';
    return admin.firestore().collection(collection).doc(tag).get().then(tagSnap => {
        let userCount = 0;
        if (tagSnap.exists)
            userCount = tagSnap.data()['userCount'];
        return tagSnap.ref.set({ userCount: userCount + 1 }).then(presult => {
            return tagSnap.ref.collection('users').doc(user).set(update).then(result => userCount < 1);
        });
    }).then(isNew => {
        if (isNew)
            console.log(`New ${collection} added`, tag, user);
    });
}
export const removeTag = (user: string, tag: string, isSkill = false): Promise<any> => {
    const collection = isSkill ? 'skills' : 'passions';
    return admin.firestore().collection(collection).doc(tag).get().then(tagSnap => {
        let userCount = 0;
        if (tagSnap.exists)
            userCount = tagSnap.data()['userCount'];
        else
            console.error('tag count not found', collection, tag);
        userCount -= 1;
        return tagSnap.ref.collection('users').doc(user).delete().then(presult => {
        if (userCount < 1)
            return tagSnap.ref.delete().then(result => true);
        else
            return tagSnap.ref.set({ userCount: userCount - 1 }).then(result => false);
        });
    }).then(isDelete => {
        if (isDelete)
            console.log(`${collection} deleted`, tag, user);    
    });
}

export const updateTags = functions.firestore.document('users/{userId}/userData/tags').onUpdate((change, context): Promise<any> => {
    // vals
    const prevVal: ITags = <any>change.before.data();
    const newVal: ITags= <any>change.after.data();
    const uid = context.params.userId;
    const update = {ref: change.after.ref.parent.parent };
    // sort new / old
    const newPassions = newVal.passions.filter(passsion => prevVal.passions.indexOf(passsion) === -1);
    const removePassions = prevVal.passions.filter(passion => newVal.passions.indexOf(passion) === -1);
    const newSkills = newVal.skills.filter(skill => prevVal.skills.indexOf(skill) === -1);
    const removeSkills = prevVal.skills.filter(skill => newVal.skills.indexOf(skill) === -1);

    //TODO: add payment forms here

    // returns
    return change.after.ref.set(newVal).then(result => {
        newPassions.forEach(passion => addTag(uid, update, passion));
    }).then(() => {
        // TODO: make these while... maybe
        removePassions.forEach(passion => removeTag(uid, passion));
    }).then(() => {
        newSkills.forEach(skill => addTag(uid, update, skill, true));
    }).then(() => {
        removeSkills.forEach(skill => removeTag(uid, skill, true));
    }).then(() => {
        const tagType = [];
        if (newPassions.length > 0)
            tagType.push('Passion added');
        if (removePassions.length > 0)
            tagType.push('Passion removed');
        if (newSkills.length > 0)
            tagType.push('Skill added');
        if (removeSkills.length > 0)
            tagType.push('Skill removed');
        console.info(tagType.join(', '), uid);
    });
});