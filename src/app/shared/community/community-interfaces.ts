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
    name?: string;
    fName: string;
    lName: string;
    email: string;
    about: string;
    skills: string[];
    passions: string[];
    location: string;
    connections: number;
    paymentForm: Payments[];
    imgUrl?: string;
}
export interface IMessage {
    name: string;
}
export interface ICommunitySkills {
    [skill: string]: IProfile[];
}
export interface ICommunityData {
    name: string;
    members: IProfile[];
    messages: IMessage[];
    link: string;
    skills?: ICommunitySkills[];
}
export interface INavigation {
    lat: number;
    lng: number;
}
export interface ICommunity {
    name: string;
    desc: string;
    img: {
        jpf: string;
        webp: string;
        else: string;
    };
    location: string;
    nav: INavigation;
    hyp: number;
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