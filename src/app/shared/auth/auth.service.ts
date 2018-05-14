import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { IProfile, Payments } from '../community/community-interfaces';

@Injectable()
export class AuthService {
    token: string;

    constructor() { }

    /*
    signupUser(email: string, password: string) {
        // your code for signing up the new user
    }
    */
    registerUser(reg: IRegister) {
        const newProfile: IProfile = {
            name: reg.fName + '' + reg.lName,
            fName: reg.fName,
            lName: reg.lName,
            email: reg.email,
            location: reg.location,
            passions: reg.passions,
            skills: reg.skills,
            about: reg.about,
            paymentForm: reg.payment,
            connections: 0
        };
        if (reg.imgUrl)
            newProfile.imgUrl = reg.imgUrl;
        console.log(newProfile);
    }
    updateProfileInfo(update: IYourProfile) {
        console.log(update);
    }
    updateProfileData(update: IUpdateProfile) {
        console.log(update);
    }
    signinUser(email: string, password: string) {
        // your code for checking credentials and getting tokens for for signing in user
    }

    logout() {
        this.token = null;
    }

    getToken() {
        return this.token;
    }

    isAuthenticated() {
        // here you can check if user is authenticated or not through his token
        return true;
    }

    getUser(): IProfile {
        return baxter;
    }
}
export interface IRegister {
    email: string;
    pass: string;
    fName: string;
    lName: string;
    location: string;
    skills: string[];
    passions: string[];
    payment: Payments[];
    about: string;
    imgUrl?: string;
}
export interface IYourProfile {
    fName: string;
    lName: string;
    about: string;
    location: string;
    skills: string[];
    passions: string[];
    payment: number[];
}
export interface IUpdateProfile {
    email: string;
    pass?: string;
    pass1?: string;
    pass2?: string;
}

// TODO: remove this
const baxter: IProfile = {
    name: 'Baxter Cochennet',
    fName: 'Baxter',
    lName: 'Cochennet',
    email: 'fakeEmail@mail.com',
    about: 'Simple about',
    skills: ['Accounting', 'Personal Finance', 'Budgeting', 'Photography'],
    passions: ['Cycling', 'Fly Fishing', 'Photography', 'SUP', 'Cliff Jumping', 'Community'],
    location: 'Denver',
    connections: 15,
    paymentForm: [Payments['Nothing, happy to help']],
    imgUrl: '/assets/img/photos/baxter.jpg'
};