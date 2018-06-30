import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
admin.initializeApp();
import { DocumentReference, GeoPoint } from '@google-cloud/firestore';
// import { FieldValue } from 'firebase-admin';
// var FieldValue = require('firebase-admin').firestore.FieldValue;


/* ** INTERFACES ** */
interface ITags {
    passions: string[];
    skills: string[];
    paymentForm: number[];
}
interface IProfile<T> {
    about: string;
    email: string;
    fName: string;
    lName: string;
    location: T;
}
interface ILocation {
    location: string;
    nav: GeoPoint;
}

// Community Interface
interface ICommunity {
    desc: string;
    img: DocumentReference;
    location: DocumentReference;
    members: number;
    name: string;
    join?: string;
}
interface ICommunityMembers {
    founder: DocumentReference;
    members: DocumentReference[];
}
interface IMessage {
    text: string;
    user: number;
    uuid?: string;
    index: number;
}
interface IChat {
    last: string;
    subject: string;
    users: DocumentReference[];
    newChat?: boolean;
    newMessage?: IMessage;
    currentIndex: number;
    timestamp: any;
}
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

/* ** PROFILE ** */
export const updateProfile = functions.firestore.document('users/{userId}/userData/profile').onUpdate((change, context): Promise<any> => {
    // if (typeof change.before.data()['location'] === 'object')
    //     return null;
    const prevVal: IProfile<DocumentReference> = <any>change.before.data();
    const newVal: IProfile<ILocation> = <any>change.after.data();
    const uid = context.params.userId;
    const newName = newVal.fName + ' ' + newVal.lName;
    let locationRef = prevVal.location;
    let newUser = false;
    try {
        locationRef.id.slice();
        if (newVal.email) {
            console.log('email');
            return null;
        }
    } catch (error) {
        try {
            newVal.location.location.slice();
            newUser = true;
            console.log('notEmail');
        } catch (error) {
            return null;
        }
    }


    return change.after.ref.set(newVal, { merge: true }).then(result => {
        return admin.firestore().collection('users').doc(uid).get().then(userSnap => {
            if (userSnap.exists)
                newUser = userSnap.data()['new'];
            return userSnap.ref;
        });
    }).then(userRef => {
        // const exx = result ? 'exists' : 'DNE';
        if (newUser) {
            return userRef.getCollections().then(collections => {
                return collections.length < 2; // double check for connections or messages
            }).then(isNew => {
                if (isNew)
                    return admin.firestore().collection('location').add(newVal.location).then(ref => {
                        locationRef = ref;
                        return userRef.set({ connections: 0});
                    });
                else {
                    newUser = false;
                    throw new Error('Created new user where user already exists');
                }
            });
        } else return locationRef.set(newVal.location);
    }).then(result => {
        return change.after.ref.set({ location: locationRef }, { merge: true });
    }).then(userSet => {
        return admin.firestore().collection('users').doc(uid).set(
            {
                name: newName,
                location: newVal.location.location
            }, { merge: true });
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
    const newVal: ITags = <any>change.after.data();
    if (newVal === prevVal)
        return null;
    const uid = context.params.userId;
    const update = {ref: change.after.ref.parent.parent };
    // sort new / old
    let newPassions, removePassions;
    if (prevVal.passions) {
        newPassions = newVal.passions.filter(passsion => prevVal.passions.indexOf(passsion) === -1);
        removePassions = prevVal.passions.filter(passion => newVal.passions.indexOf(passion) === -1);
    } else {
        newPassions = newVal.passions;
        removePassions = [];
    }
    let newSkills, removeSkills;
    if (prevVal.skills) {
        newSkills = newVal.skills.filter(skill => prevVal.skills.indexOf(skill) === -1);
        removeSkills = prevVal.skills.filter(skill => newVal.skills.indexOf(skill) === -1);
    } else {
        newSkills = newVal.skills;
        removeSkills = [];
    }

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

export const joinCommunity = functions.firestore.document('community/{communityId}').onUpdate((change, context): Promise<any> => {
    const prevVal: ICommunity = <any>change.before.data();
    const newVal: ICommunity = <any>change.after.data();
    const communityId: string = context.params.communityId;
    if (newVal === prevVal)
        return null;
    let newUser: string;
    if (newVal.join)
        newUser = newVal.join;
    else return null;
    return admin.firestore().collection('community').doc(communityId).collection('communityData').doc('members').get().then(membersSnap => {
        if (membersSnap.exists) {
            const members: ICommunityMembers = <any>membersSnap.data();
            let membCount = 0;
            members.members.forEach(member => {
                membCount += 1;
                if (member.id === newUser)
                    newUser = null;;
            });
            return { comRef: membersSnap.ref, userRef: null, memberData: members, count: membCount };
        } else {
            console.error('Error while getting community member data');
            return null;
        }
    }).then(comData => {
        if (newUser !== null && comData !== null) {
            const tmpNewMembers = comData;
            return admin.firestore().collection('users').doc(newUser).get().then(userSnap => {
                if (userSnap.exists) {
                    tmpNewMembers.memberData.members.push(userSnap.ref);
                    tmpNewMembers.userRef = userSnap.ref;
                    return tmpNewMembers;
                } else {
                    console.error('Error while retrieving user data ');
                    return null;
                }
            });
            //tmpUser.ref.update()
        } else {
            console.error('User is already a member of this community');
            return null;
        }  
    }).then(comData => {
        if (comData !== null) {
            return comData.comRef.update(comData.memberData).then(result => {
                return comData;
            });
        } else return null;
    }).then(comData => {
        if (comData !== null)
            return admin.firestore().collection('community').doc(communityId).set(<ICommunity>{
                desc: prevVal.desc,
                img: prevVal.img,
                location: prevVal.location,
                members: comData.count + 1,
                name: prevVal.name
            }).then(result => {
                return comData;
            });
        else {
            console.error('Error while adding member');
            return null;
        }
    }).then(comData => {
        if (comData !== null)
            return comData.userRef.collection('communities').doc(communityId).set({ ref: comData.comRef.parent.parent });
        else return null;
    })
});

export const startChat = functions.firestore.document('message/users/chats/{chat}').onCreate((create, context): Promise<any> => {
    // const prevVal: ICommunity = <any>change.before.data();
    const newVal: IChat = <any>create.data();
    return new Promise<boolean>(resolve => {
        if (newVal.newChat) {
            newVal.users.forEach(newUser => {
                const mesUp: { ref: DocumentReference, newMessage?: string } = {
                    ref: create.ref
                }
                if (newVal.users.indexOf(newUser) !== 0)
                    mesUp.newMessage = newVal.subject;
                return newUser.collection('messages').doc(create.id).set(mesUp);
            });
            resolve(true);
        }
        else resolve(false);
    }).then(res => {
        if (res)
            return create.ref.set({
                subject: newVal.subject,
                last: newVal.subject,
                users: newVal.users,
                currentIndex: 1,
                start: admin.firestore.FieldValue.serverTimestamp()
            });
        else return null;
    });
});
export const newMessage = functions.firestore.document('message/users/chats/{chat}').onUpdate((change, context): Promise<any> => {
    const prevVal: IChat = <any>change.before.data();
    const newVal: IChat = <any>change.after.data();
    const newIndex = prevVal.currentIndex - 1;
    if (newVal.newMessage && newVal.newMessage !== prevVal.newMessage) {
        const mesCollection = change.after.ref.collection('messages');
        if (prevVal.users[newVal.newMessage.user].id === newVal.newMessage.uuid)
            return mesCollection.get().then(mesSnap => {
                return mesCollection.doc(newIndex.toString()).set(<IMessage>{
                    text: newVal.newMessage.text,
                    user: newVal.newMessage.user,
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                    index: newIndex
                }).then(ref => {
                    return admin.firestore().doc(change.before.ref.path).set(<IChat>{
                        last: newVal.newMessage.text,
                        subject: prevVal.subject,
                        users: prevVal.users,
                        currentIndex: newIndex,
                        timestamp: admin.firestore.FieldValue.serverTimestamp()
                    });
                }).then(() => {
                    prevVal.users.forEach(user => {
                        if (user.id !== newVal.newMessage.uuid)
                            return user.collection('messages').doc(change.after.id).set(
                                {
                                    newMessage: newVal.newMessage.text
                                }, { merge: true });
                        else return null;
                    });
                })
            })
        else
            console.error('Failed secondary security authentication');
        return null;
    } else return null;
});