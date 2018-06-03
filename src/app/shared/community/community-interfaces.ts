import { DocumentReference, GeoPoint, DocumentData } from '@firebase/firestore-types';
import { Reference } from '@firebase/storage-types';
import { AngularFireStorage } from 'angularfire2/storage';

export function _coords_to_inavigate(coords: Coordinates): INavigation {
    const nav: INavigation = {
        lat: coords.latitude,
        lng: coords.longitude
    };
    return nav;
}

export enum Payments {
    'Nothing, happy to help',
    'Pizza',
    'Tacos',
    'Beer (must be 21)',
    'Wine (must be 21)',
    'Cash'
}
export interface IProfile {
    fName: string;
    lName: string;
    about: string;
    email: string;
    location?: DocumentReference | {location: string, nav: GeoPoint};
}
export interface ITags {
    passions: string[];
    paymentForm: Payments[];
    skills: string[];
}
export interface IUserData {
    tags: ITags;
    profile: IProfile;
}
export interface IUser {
    name?: string;
    userData?: DocumentReference | IUserData;
    skills?: string[];
    passions?: string[];
    location: string;
    connections: number;
    imgUrl?: DocumentReference | string;
}

/*
export class IUser<T> {
    name?: string;
    userData?: T; // DocumentReference | IUserData;
    private _skills?: string[];
    get skills() {
        return this._skills;
    }
    set skills(skills: string[]) {

    }
    passions?: string[];
    location: DocumentReference | string;
    connections: number;
    imgUrl?: DocumentReference | string;
}
*/
export interface IMessage {
    name: string;
}
export interface ICommunitySkills {
    [skill: string]: IUser[];
}
export interface IImg {
    jpf: string;
    webp: string;
    else: string;
}
export interface ICommunityData {
    name: string;
    members: IUser[];
    messages: IMessage[];
    skills?: ICommunitySkills[];
}
export interface INavigation {
    lat: number;
    lng: number;
}
export interface ICommunity {
    name: string;
    desc: string;
    img: IImg | DocumentReference;
    location?: string;
    nav?: INavigation;
    members: number;
    link: string;
}
export enum CommunitySearchType {
    skills,
    members,
    skillsSkills,
    skillsMembers,
    topSkills,
    communityMember,
    messageMembers
}
export const placeholderUrl =
    // tslint:disable-next-line:max-line-length
    `https://firebasestorage.googleapis.com/v0/b/open-garage-fb.appspot.com/o/img%2Fplaceholder.gif?alt=media&token=d081080f-eee8-437f-b638-564f5f55d587`;
