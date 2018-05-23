import { Router } from '@angular/router';
import { Injectable } from '@angular/core';
import { IProfile, Payments, IUser, IUserData } from '../community/community-interfaces';

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
        const newProfile: IUser = {
            name: reg.fName + '' + reg.lName,
            userData: {
                profile: {
                    fName: reg.fName,
                    lName: reg.lName,
                    about: reg.about,
                    email: reg.email
                },
                tags: {
                    passions: reg.passions,
                    skills: reg.skills,
                    paymentForm: reg.payment,
                }
            },
            location: reg.location,
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

    getUser(): IUser {
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
const baxter: IUser = {
    name: 'Baxter Cochennet',
    skills: ['Accounting', 'Personal Finance', 'Budgeting', 'Photography'],
    passions: ['Cycling', 'Fly Fishing', 'Photography', 'SUP', 'Cliff Jumping', 'Community'],
    location: 'Denver',
    connections: 15,
    imgUrl: '/assets/img/photos/baxter.jpg'
};