import { Injectable } from '@angular/core';
import { ICommunity } from './community-interfaces';
import { INavigation } from './community-interfaces';

@Injectable()
export class CommunitiesService {

    locationSearch(location: INavigation): ICommunity[] {
        return testCommunities;
    }
}

const testCommunities: ICommunity[] = [
    {
        name: 'Test Community',
        desc: 'a short description about the community and such',
        img: {
            webp: '../../../assets/img/photos/eclipse.webp',
            jpf: '../../../assets/img/photos/eclipse.jpf',
            else: '../../../assets/img/photos/eclipse.jpg'
        },
        location: 'Denver',
        nav: {
            lat: 39.7392,
            lng: -104.9903
        },
        hyp: 112.2593,
        members: 8,
        link: 'testlink'
    },
    {
        name: 'Univeristy of Denver',
        desc: 'The official communtiy of the University of Denver.',
        img: {
            webp: '../../../assets/img/photos/eclipse.webp',
            jpf: '../../../assets/img/photos/eclipse.jpf',
            else: '../../../assets/img/photos/eclipse.jpg'
        },
        location: 'Denver',
        nav: {
            lat: 39.682380,
            lng: -104.964384
        },
        hyp: 112.2149,
        members: 8,
        link: 'testlink'
    },
    {
        name: 'Local PD Community',
        desc: 'The community for the Denver Police Department',
        img: {
            webp: '../../../assets/img/photos/fish.webp',
            jpf: '../../../assets/img/photos/fish.jpf',
            else: '../../../assets/img/photos/fish.jpg'
        },
        location: 'Denver',
        nav: {
            lat: 39.687380,
            lng: -104.959384
        },
        hyp: 112.2120,
        members: 8,
        link: 'testlink'
    }
];