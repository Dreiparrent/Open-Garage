import * as functions from 'firebase-functions';
const gcs = require('@google-cloud/storage');
import * as os from 'os';
// import { Storage } from '@google-cloud/storage';
import * as imagemin from 'imagemin';
import * as webp from 'imagemin-webp';
import * as admin from 'firebase-admin';
import * as path from 'path';
admin.initializeApp();
// import { DocumentReference, GeoPoint } from '@google-cloud/firestore';
// import { firestore } from 'firebase';
// declare var DocumentReference: firestore.DocumentReference;
// var FieldValue = require('firebase-admin').firestore.FieldValue;

//#region Interfaces
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
    nav: FirebaseFirestore.GeoPoint;
}

// Community Interface
interface ICommunityRegister {
    new: boolean;
    name: string;
    link: string;
    location: {
        name: string,
        nav: FirebaseFirestore.GeoPoint
    };
    desc: string;
    img?: any;
    members: number;
    founder: FirebaseFirestore.DocumentReference;
}
interface ICommunity {
    desc: string;
    img: string;
    location: FirebaseFirestore.DocumentReference;
    members: number;
    name: string;
    join?: string;
}
interface ICommunityMembers {
    founder: FirebaseFirestore.DocumentReference;
    members: FirebaseFirestore.DocumentReference[];
}
interface IMessage {
    text: string;
    user: number;
    uuid?: string;
    // index: number;
}
interface IChat {
    last: string;
    subject: string;
    users?: FirebaseFirestore.DocumentReference[];
    newChat?: boolean;
    newMessage?: IMessage;
    count: number;
    // currentIndex: number;
    timestamp: any;
}
interface IUserMessage {
    ref?: FirebaseFirestore.DocumentReference;
    timestamp: any;
    newMessage?: string;
}
//#endregion

// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

//#region Profile
export const createProfileGuard = functions.firestore.document('users/{userID}').onWrite((change, context): Promise<any> => {
    if (change.before.exists) {
        if (change.after.data()["new"] && !change.before.data()["new"])
            return change.before.ref.set(change.before.data()).then(() => console.log('user overwrite prevented'));
        // return null;
    }
    return null;
});
export const updateProfile = functions.firestore.document('users/{userId}/userData/profile').onUpdate((change, context): Promise<any> => {
    // if (typeof change.before.data()['location'] === 'object')
    //     return null;    
    const prevVal: IProfile<FirebaseFirestore.DocumentReference> = <any>change.before.data();
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
            if (userSnap.exists && change.before.exists)
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
//#endregion
//#region Tags
export const addTag = (user: string, update: { ref: FirebaseFirestore.DocumentReference }, tag: string, isSkill = false): Promise<any> => {
    const collection = isSkill ? 'skills' : 'passions';
    return admin.firestore().collection(collection).doc(tag).get().then(tagSnap => {
        let userCount = 0;
        if (tagSnap.exists)
            userCount = tagSnap.data()['userCount'];
        return tagSnap.ref.set({ userCount: userCount + 1, tag: tag.toLowerCase() }).then(presult => {
            return tagSnap.ref.collection('users').doc(user).set(update).then(result => userCount < 2);
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
//#endregion
//#region Community
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
export const createCommunity = functions.firestore.document('community/{communityId}').onWrite((change, context) => {
    const newVal: ICommunityRegister = <any>change.after.data();
    try {
        if (!newVal.new)
            return null;
        if (!newVal.link)
            return null;
        if (newVal.link !== context.params.communityId)
            return null;
    } catch (error) {
        return null;
    }
    console.log(newVal);
    console.log(newVal.location);
    return admin.firestore().collection('location').add({
        location: newVal.location.name,
        nav: newVal.location.nav,
        ref: change.after.ref,
        type: 1
    }).then(ref => {
        return ref.collection('community').doc(newVal.link).set({ ref: 'community/' + newVal.link }).then(() => {
            return change.after.ref.set({
                desc: newVal.desc,
                members: 1,
                name: newVal.name,
                location: ref,
                img: 'gs://open-garage-fb.appspot.com/img/placeholder.gif'
            }).then(() => {
                return change.after.ref.collection('communityData').doc('members').set({
                    founder: newVal.founder,
                    members: [newVal.founder]
                }).then(() => {
                    const messageRef = admin.firestore().collection('message/community/communityID').doc(newVal.link);
                    return messageRef.set({
                        messageCount: 0,
                        recent: ''
                    }).then(() => {
                        console.log('Community Created', newVal.link);
                        return change.after.ref.collection('communityData').doc('messages').set({ref: messageRef});
                    })
                })
            });
        })

    })
});
//#endregion
//#region Chat
export const startChat = functions.firestore.document('message/users/chats/{chat}').onCreate((create, context): Promise<any> => {
    // const prevVal: ICommunity = <any>change.before.data();
    const newVal: IChat = <any>create.data();
    return new Promise<boolean>(resolve => {
        if (newVal.newChat) {
            newVal.users.forEach(newUser => {
                const mesUp: IUserMessage = {
                    ref: create.ref,
                    timestamp: admin.firestore.FieldValue.serverTimestamp()
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
                start: admin.firestore.FieldValue.serverTimestamp()
            });
        else return null;
    });
});
export const newMessage = functions.firestore.document('message/{parent}/chats/{chat}').onUpdate((change, context): Promise<any> => {
    const prevVal: IChat = <any>change.before.data();
    const newVal: IChat = <any>change.after.data();
    // const newIndex = prevVal.currentIndex - 1;
    // TODO: make this account for the multiple calls
    const userChat = (context.params.parent === 'users');
    if (newVal.newMessage && newVal.newMessage !== prevVal.newMessage) {
        const mesCollection = change.after.ref.collection('messages');
        if (!userChat || prevVal.users[newVal.newMessage.user].id === newVal.newMessage.uuid)
            return mesCollection.get().then(mesSnap => {
                const mesCount = mesSnap.size + 1;
                return mesCollection.add(<IMessage>{
                    text: newVal.newMessage.text,
                    user: newVal.newMessage.user,
                    timestamp: admin.firestore.FieldValue.serverTimestamp(),
                }).then(ref => {
                    const chatData: IChat = {
                        last: newVal.newMessage.text,
                        subject: prevVal.subject,
                        count: mesCount,
                        timestamp: admin.firestore.FieldValue.serverTimestamp()
                    }
                    if (userChat)
                        chatData.users = prevVal.users;
                    return admin.firestore().doc(change.before.ref.path).set(chatData);
                    }).then(() => {
                        if (userChat)
                            prevVal.users.forEach(user => {
                                const userMessage: IUserMessage = {
                                    timestamp: admin.firestore.FieldValue.serverTimestamp()
                                }
                                if (user.id !== newVal.newMessage.uuid)
                                    userMessage.newMessage = newVal.newMessage.text;
                                return user.collection('messages').doc(change.after.id).set(userMessage, { merge: true });
                            });
                        else return null;
                })
            })
        else
            console.error('Failed secondary security authentication');
        return null;
    } else return null;
});
//#endregion
//#region Storage
export const imageUpload = functions.storage.object().onFinalize((object, context) => {
    const filePath = object.name.split('/');
    const contentType = object.contentType;
    const fileName = path.basename(object.name);
    const extName = path.extname(object.name);
    const tmpPath = path.join(os.tmpdir(), fileName);
    const bucket = new gcs.Storage().bucket(object.bucket)
    // const bucket = gcs.bucket(object.bucket);
    
    console.log('object', object);
    console.log('context', context);
    if (object.contentType === 'image/webp') {
        console.log('already converted');
        return null;
    } if (!object.contentType.startsWith('image/')) {
        console.log('Not an Image');
        return null;
    }
    if (filePath[1] === 'user') {
        const uid = filePath[2];
        return bucket.file(object.name).download({ destination: tmpPath }).then(() => {
            console.log('Image Downloaded to', tmpPath)
            return imagemin([tmpPath], '/tmp', {
                plugins: [
                    webp({ quality: 75 })
                ]
            }).then(res => {
                
                console.log(res);
                console.log(filePath);
                console.log(fileName);
                console.log(extName);
                const uploadPath = path.join(path.dirname(object.name), path.basename(res[0].path))
                // return null;
                return bucket.upload(res[0].path, { destination: uploadPath }).then(() => {
                    const imgUrl = 'gs://' + object.bucket + '/' + object.name;
                    return admin.firestore().collection('users').doc(uid).set({ imgUrl: imgUrl }, { merge: true });
                });
            })
        });
    } else return null;
});
//#endregion