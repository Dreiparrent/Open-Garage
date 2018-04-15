import { Injectable } from '@angular/core';

@Injectable()
export class RegisterService {
    registerUser(reg: IRegister) {
        console.log(reg);
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
    payment: number[];
    about: string;
}