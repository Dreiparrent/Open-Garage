export interface IProfile {
    name: string;
    location: string;
    connections: number;
    imgUrl?: string;
}
export interface ICommunityData {
    name: string;
    skills: any;
    members: IProfile[];
    messages: any;
    link: string;
}
export interface ICommunity {
    name: string;
    desc: string;
    link: string;
}