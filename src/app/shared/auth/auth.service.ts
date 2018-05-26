import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { IProfile, Payments, IUser, IUserData, ITags } from '../community/community-interfaces';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { DocumentReference, GeoPoint } from '@firebase/firestore-types';

@Injectable()
export class AuthService {
    token: string;
    userRef: DocumentReference;
    currentUser: IUser;
    currentData: IUserData;

    constructor(private db: AngularFirestore, private fauth: AngularFireAuth) {
        this.userRef = db.collection('users').doc('A5LOuQSWacJroy4NuTFg').ref;
    }

    /*
    signupUser(email: string, password: string) {
        // your code for signing up the new user
    }
    */
    registerUser(reg: IRegister) {
        const newProfile: IUser = {
            name: reg.fName + '' + reg.lName,
            userData: {
                profile: {
                    fName: reg.fName,
                    lName: reg.lName,
                    about: reg.about,
                    email: reg.email
                },
                tags: {
                    passions: reg.passions,
                    skills: reg.skills,
                    paymentForm: reg.payment,
                }
            },
            location: reg.location,
            connections: 0
        };
        if (reg.imgUrl)
            newProfile.imgUrl = reg.imgUrl;
        console.log(newProfile);
    }
    updateProfileInfo(update: [IUser, boolean]) {
        // console.log(update);
        const currentData = this.currentUser.userData as IUserData;
        const userData = update[0].userData as IUserData;
        this.userRef.collection('userData').doc('profile').update({
            about: userData.profile.about,
            fName: userData.profile.fName,
            lName: userData.profile.lName
        }).then(() => {
            if (update[1])
                this.userRef.collection('userData').doc('tags').update(userData.tags);
        });
    }
    updateProfileData(update: IUpdateProfile) {
        console.log(update);
    }
    signinUser(email: string, password: string) {
        // your code for checking credentials and getting tokens for for signing in user
    }

    logout() {
        this.token = null;
    }

    getToken() {
        return this.token;
    }

    isAuthenticated() {
        // here you can check if user is authenticated or not through his token
        return true;
    }

    getUser(): Promise<IUser> {
        return this.userRef.get().then(userSnap => {
            if (userSnap.exists)
                return userSnap.ref.collection('userData').doc('profile').get().then(profileSnap => {
                    if (profileSnap.exists) {
                        const profileData: IProfile = <any>profileSnap.data();
                        return (profileData.location as DocumentReference).get().then(locSnap => {
                            if (locSnap.exists)
                                return <any>locSnap.data();
                            else throw new Error('Cannot accquire profile location for profile');
                        }).then((loc: { location: string, nav: GeoPoint }) => {
                            profileData.location = loc;
                            return profileData;
                        });
                    } else throw new Error('Cannot accquire profile data');
                    // return newUser;
                }).then(user => {
                    return userSnap.ref.collection('userData').doc('tags').get().then(tagsSnap => {
                        if (tagsSnap.exists)
                            return { profile: user, tags: <ITags><any>tagsSnap.data() };
                        else throw new Error('Cannot accquire profile tags');
                    });
                }).then(userData => {
                    const tmpUser: IUser = <any>userSnap.data();
                    return (tmpUser.imgUrl as DocumentReference).get().then(imgSnap => {
                        if (imgSnap.exists)
                            return <any>imgSnap.data()['else'];
                        else throw new Error('Cannot accquire profile image');
                    }).then((imgData: string) => {
                        console.log(imgData);
                        return {
                            connections: tmpUser.connections,
                            imgUrl: imgData,
                            location: tmpUser.location,
                            name: tmpUser.name,
                            passions: userData.tags.passions,
                            skills: userData.tags.skills,
                            userData: userData
                        };
                    });
                });
            else throw new Error('Cannot get current uesr');
        }).then((user: IUser) => {
            this.currentUser = user;
            this.currentData = (user.userData as IUserData);
            return user;
        }).catch(error => {
            throw new Error( error);
            // console.error('Firebase auth get user', error);
        });
    }
}
export interface IRegister {
    email: string;
    pass: string;
    fName: string;
    lName: string;
    location: string;
    skills: string[];
    passions: string[];
    payment: Payments[];
    about: string;
    imgUrl?: string;
}
export interface IYourProfile {
    fName: string;
    lName: string;
    about: string;
    location: string;
    skills: string[];
    passions: string[];
    payment: number[];
}
export interface IUpdateProfile {
    email: string;
    pass?: string;
    pass1?: string;
    pass2?: string;
}

// TODO: remove this
const baxter: IUser = {
    name: 'Baxter Cochennet',
    skills: ['Accounting', 'Personal Finance', 'Budgeting', 'Photography'],
    passions: ['Cycling', 'Fly Fishing', 'Photography', 'SUP', 'Cliff Jumping', 'Community'],
    location: 'Denver',
    connections: 15,
    imgUrl: '/assets/img/photos/baxter.jpg'
};