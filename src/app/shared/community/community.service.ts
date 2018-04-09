import { Injectable } from '@angular/core';
import { ICommunity, ICommunityData, IProfile } from './community-interfaces';

@Injectable()
export class CommunityService {

    constructor() { }
    // TODO: use community links
    getCommunities(uid: string) {
        return communities;
    }
    getCommunityData(communityID: string) {
        const parsed = parseInt(communityID, 10);
        if (isNaN(parsed))
            return detailCommunities[Communities[communityID]];
        return detailCommunities[parsed];
    }
}
// Names
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
// Test Communities
const testData: ICommunityData = {
    name: 'Test Community',
    skills: 'no skills',
    members: [baxter, me],
    messages: '',
    link: 'test'
};
const test: ICommunity = {
    name: testData.name,
    desc: '',
    link: testData.link
};
/*
const test2Data: ICommunityData = {
    name: 'Test Community',
    skills: 'no skills',
    members: [baxter, me],
    messages: '',
    link: 'test'
};
const test2: ICommunity = {
    name: testData.name,
    desc: '',
    link: testData.link
};

const test3Data: ICommunityData = {
    name: 'Test Community',
    skills: 'no skills',
    members: [baxter, me],
    messages: '',
    link: 'test'
};
const test3: ICommunity = {
    name: testData.name,
    desc: '',
    link: testData.link
};
*/
// Helpers
enum Communities { test }
const communities: ICommunity[] = [ test ];
const detailCommunities: ICommunityData[] = [ testData ];