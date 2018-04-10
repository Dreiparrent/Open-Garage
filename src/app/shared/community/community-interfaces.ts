export interface IProfile {
    name: string;
    about: string;
    location: string;
    connections: number;
    imgUrl?: string;
}
export interface IMessage {
    name: string;
}
export interface ICommunityData {
    name: string;
    skills: any;
    members: IProfile[];
    messages: IMessage[];
    link: string;
}
export interface ICommunity {
    name: string;
    desc: string;
    link: string;
}