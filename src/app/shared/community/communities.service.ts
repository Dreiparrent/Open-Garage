import { Injectable } from '@angular/core';
import { ICommunity } from './community-interfaces';
import { INavigation } from './community-interfaces';

@Injectable()
export class CommunitiesService {

    locationSearch(hype: number): Promise<ICommunity[]> {
        const prom = new Promise<ICommunity[]>((resolve, reject) => {
            setTimeout(() => {
                if (hype > 9)
                    resolve(testCommunities);
                else
                    reject('Navigation (lng + lat) hypotenuse is less than 10');
            }, 200);
        });
        return prom;
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
    },
    {
        name: 'Neighborhood Community',
        desc: 'Just a small nieghborhood community',
        img: {
            webp: '../../../assets/img/photos/fish.webp',
            jpf: '../../../assets/img/photos/fish.jpf',
            else: '../../../assets/img/photos/fish.jpg'
        },
        location: 'Denver',
        nav: {
            lat: 39.684380,
            lng: -104.969384
        },
        hyp: 112.2120,
        members: 8,
        link: 'testlink'
    },
    {
        name: 'One Observatory Park',
        desc: 'The best appartments for DU students',
        img: {
            webp: '../../../assets/img/photos/fish.webp',
            jpf: '../../../assets/img/photos/fish.jpf',
            else: '../../../assets/img/photos/fish.jpg'
        },
        location: 'Denver',
        nav: {
            lat: 39.678210,
            lng: -104.958884
        },
        hyp: 112.2120,
        members: 8,
        link: 'testlink'
    }
];