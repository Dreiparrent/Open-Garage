import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { IProfile, Payments, IUser, IUserData, ITags } from '../community/community-interfaces';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireAuth } from 'angularfire2/auth';
import { DocumentReference } from '@firebase/firestore-types';
import { auth, firestore, User } from 'firebase/app';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AngularFireStorage } from 'angularfire2/storage';

@Injectable()
export class AuthService {
    token: string;
    userRef: DocumentReference;
    userProvider: string[];
    protected _user: User;
    set user(user: User) {
        this._user = user;
        this.token = user.uid;
        this.isAith = true;
    }
    get user() {
        return this._user;
    }

    _isAuth = new BehaviorSubject(false);
    private get isAuth() {
        return this._isAuth.getValue();
    }
    private set isAith(authStatus: boolean) {
        if (authStatus && this.user)
            this._isAuth.next(authStatus);
        else if (!authStatus) this._isAuth.next(authStatus);
    }
    userCred: auth.AuthCredential;
    currentUser: IUser;
    currentData: IUserData;

    constructor(private db: AngularFirestore, private fireAuth: AngularFireAuth, private fireStorage: AngularFireStorage) {
        // this.userRef = db.collection('users').doc('A5LOuQSWacJroy4NuTFg').ref;
        fireAuth.authState.subscribe(user => {
            if (user) {
                this.user = user;
                this.userRef = this.db.collection('users').doc(this.token).ref;
                this.fireAuth.auth.fetchProvidersForEmail(user.email).then(provider => {
                    this.userProvider = provider;
                });
            }
        });
        if (environment.production)
            this.signinUser(environment.loginInfo.email, environment.loginInfo.password);
    }
//#region Logins
    signinUser(email: string, password: string): Promise<boolean> {
        return this.fireAuth.auth.signInWithEmailAndPassword(email, password).then((result: auth.UserCredential) => {
            this.userCred = result.credential;
            this.user = result.user;
            return true;
        }, (error: any) => {
            console.error(error);
            return false;
        });
    }
    gAuth(): Promise<boolean> {
        return this.fireAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then((result: auth.UserCredential) => {
            this.userCred = result.credential;
            this.user = result.user;
            return true;
        }, (error: any) => {
            console.log(error);
            return false;
        });
    }
    fAuth(): Promise<boolean> {
        return this.fireAuth.auth.signInWithPopup(new auth.FacebookAuthProvider()).then((result: auth.UserCredential) => {
            this.userCred = result.credential;
            this.user = result.user;
            return true;
        }, (error: any) => {
            console.log(error);
            return false;
        });
    }
//#endregion
    /* TODO: use this to first get auth key before register
    signupUser(email: string, password: string) {
        // your code for signing up the new user
    }
    */
//#region register and update
    registerUser(reg: IRegister): Observable<number> {
        const newUserData: IUserData = {
            profile: {
                about: reg.about,
                email: '',
                fName: reg.fName,
                lName: reg.lName,
                location: {
                    location: reg.location,
                    nav: new firestore.GeoPoint(39.738662, -104.992474)
                }
            },
            tags: {
                passions: reg.passions,
                paymentForm: reg.payment,
                skills: reg.skills
            }
        };
        const newUser: IUser = {
            connections: 0,
            location: reg.location,
            userData: newUserData
        };
        const progress = new Subject<number>();
        progress.next(0);
        new Promise<string>(res => {
            if (reg.type === 0) {
                newUserData.profile.email = reg.email;
                res(this.fireAuth.auth.createUserWithEmailAndPassword(reg.email, reg.pass).then((userRef: auth.UserCredential) => {
                    // TODO: userCred.additionalUserInfo.isNewUser
                    this.user = userRef.user;
                    return userRef.user.uid;
                }, error => {
                    throw new Error(error);
                }));
            } else {
                newUserData.profile.email = this.user.email;
                res(this.user.uid);
            }
        }).then(uid => {
            progress.next(25);
            console.log(uid);
            this.userRef = this.db.collection('users').doc(uid).ref;
        }).then(() => {
            return this.userRef.set({ new: true }).then(() => true, error => {
                throw new Error(error);
            }).then(res => {
                progress.next(30);
                return this.userRef.collection('userData').doc('tags').set({
                    passions: [],
                    paymentForm: [],
                    skills: []
                }).then(() => true, error => { throw new Error(error); });
            }).then(res => {
                progress.next(25);
                return this.userRef.collection('userData').doc('profile').set({})
                    .then(() => true, error => { throw new Error(error); });
            }).catch(error => {
                console.error('Error creating user', error);
                return false;
            }).then(created => {
                progress.next(40);
                if (created)
                    return this.updateProfileInfo([newUser, true]);
            }).then(newProg => {
                newProg.subscribe(prog => progress.next(prog));
            });
        });
        return progress;
        // TODO: make this an observable to track timing for load bar
        // TODO: add update profile data (get email from account)
    }
    updateProfileInfo(update: [IUser, boolean]): Observable<number> {
        const progress = new Subject<number>();
        progress.next(0);
        const userData = update[0].userData as IUserData;
        this.userRef.collection('userData').doc('profile').update({
            about: userData.profile.about,
            fName: userData.profile.fName,
            lName: userData.profile.lName,
            location: userData.profile.location
        }).then(() => true, error => { throw new Error(error); }).then(res => {
            if (res && update[1]) {
                progress.next(30);
                this.userRef.collection('userData').doc('tags').update(userData.tags).then(() => {
                    progress.next(100);
                }, error => {
                    throw new Error(error);
                });
            } else progress.next(100);
        }).catch(error => {
            console.error('Error while updating user', error);
            progress.next(-1);
            });
        return progress;
    }
    updateProfileData(update: IUpdateProfile): Observable<number> {
        const progress = new Subject<number>();
        progress.next(0);
        this.userRef.collection('userData').doc('profile').update({
            email: update.email
        }).then(() => true, error => { throw new Error(error); }).then(res => {
            progress.next(25);
            if (res) {
                progress.next(30);
                return this.fireAuth.auth.fetchProvidersForEmail('dreiparrent@gmail.com').then((providers: string[]) => {
                    progress.next(40);
                    if (providers.includes('password'))
                        return this.user.updateEmail(update.email).then(val => {
                            progress.next(60);
                            if (update.pass)
                                return this.user.updatePassword(update.pass).then(() => {
                                    progress.next(90);
                                }, error => { throw new Error(error); });
                        });
                    console.log(providers); // password | google.com
                });
            }
        }).then(() => {
            progress.next(100);
        }).catch(error => {
            progress.next(-1);
        });
        return progress;
    }
//#endregion
    logout(): Promise<boolean> {
        this.token = null;
        return this.fireAuth.auth.signOut().then(result => {
            return true;
        });
    }

    getToken() {
        return this.token;
    }

    isAuthenticated(): BehaviorSubject<boolean> {
        return this._isAuth;
    }

//#region get user
    getUser(): Promise<IUser> {
        return this.userRef.get().then(userSnap => {
            if (userSnap.exists) {
                this.token = userSnap.id;
                return userSnap.ref.collection('userData').doc('profile').get().then(profileSnap => {
                    if (profileSnap.exists) {
                        const profileData: IProfile = <any>profileSnap.data();
                        return (profileData.location as DocumentReference).get().then(locSnap => {
                            if (locSnap.exists)
                                return <any>locSnap.data();
                            else throw new Error('Cannot accquire profile location for profile');
                        }).then((loc: { location: string, nav: firestore.GeoPoint }) => {
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
                        const tmpData = userData;
                        tmpData.tags.skills = tmpUser.skills = userData.tags.skills ? userData.tags.skills : [];
                        tmpData.tags.passions = tmpUser.passions = userData.tags.passions ? userData.tags.passions : [];
                        tmpUser.userData = tmpData;
                        if (tmpUser.imgUrl)
                            return (tmpUser.imgUrl as DocumentReference).get().then(imgSnap => {
                                if (imgSnap.exists) {
                                    const other = <any>imgSnap.data()['else'];
                                    const jpf = <any>imgSnap.data()['jpf'];
                                    const webp = <any>imgSnap.data()['webp'];
                                    tmpUser.imgUrl = <any>imgSnap.data()['else'];
                                } else {
                                    tmpUser.imgUrl = placeholderUrl;
                                    console.error('Cannot accquire profile image');
                                    // throw new Error('Cannot accquire profile image');
                                }
                                return tmpUser;
                            });
                        else {
                            tmpUser.imgUrl = placeholderUrl;
                            return tmpUser;
                        }
                    }).then((user: IUser) => {
                        return {
                            connections: user.connections,
                            imgUrl: user.imgUrl,
                            location: user.location,
                            name: user.name,
                            passions: user.passions,
                            skills: user.skills,
                            userData: user.userData
                        };
                    });
            } else throw new Error('Cannot get current uesr');
        }).then((user: IUser) => {
            this.currentUser = user;
            this.currentData = (user.userData as IUserData);
            return user;
        }).catch(error => {
            throw new Error( error);
            // console.error('Firebase auth get user', error);
        });
    }
//#endregion
}
const placeholderUrl =
    // tslint:disable-next-line:max-line-length
    `https://firebasestorage.googleapis.com/v0/b/open-garage-fb.appspot.com/o/img%2Fplaceholder.gif?alt=media&token=d081080f-eee8-437f-b638-564f5f55d587`;
export interface IRegister {
    type: number;
    email?: string;
    pass?: string;
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
    // tslint:disable-next-line:max-line-length
    imgUrl: `https://firebasestorage.googleapis.com/v0/b/open-garage-fb.appspot.com/o/img%2FUUiDkyLpEmr7C9Pz9pQD%2Fbaxter.jpg?alt=media&token=6ca2dd70-ae21-4470-a23b-e8f2dc50ca65`
};