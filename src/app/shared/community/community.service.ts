import { Injectable } from '@angular/core';
import { ICommunity, IProfile } from './community-interfaces';

@Injectable()
export class CommunityService {

    constructor() { }
    getCommunity(communityID: string) {
        const parsed = parseInt(communityID, 10);
        if (isNaN(parsed))
            return communities[Communities[communityID]];
        return communities[parsed];
    }
}
const baxter: IProfile = {
    name: 'Baxter Cochennet',
    location: 'Denver',
    connections: 15,
    imgUrl: '/assets/img/photos/baxter.jpg'
};
const me: IProfile = {
    name: 'Andrei Parrent',
    location: 'Denver',
    connections: 9,
    imgUrl: '/assets/img/photos/andrei.jpg'
};
const test: ICommunity = {
    name: 'Test Community',
    skills: 'no skills',
    members: [baxter, me],
    messages: ''
};
enum Communities { test }
const communities: ICommunity[] = [ test ];