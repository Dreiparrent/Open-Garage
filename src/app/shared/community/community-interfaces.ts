export interface IProfile {
    name: string;
    location: string;
    connections: number;
    imgUrl?: string;
}
export interface ICommunity {
    name: string;
    skills: any;
    members: IProfile[];
    messages: any;
}