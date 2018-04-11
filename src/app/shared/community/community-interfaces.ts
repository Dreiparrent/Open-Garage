export interface IProfile {
    name: string;
    about: string;
    skills: string[];
    passions: string[];
    location: string;
    connections: number;
    imgUrl?: string;
}
export interface IMessage {
    name: string;
}
export interface ISkills {
    [name: string]: string[];
}
export interface ICommunityData {
    name: string;
    members: IProfile[];
    messages: IMessage[];
    link: string;
}
export interface ICommunity {
    name: string;
    desc: string;
    link: string;
}