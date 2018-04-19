import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../../../shared/community/community.service';

@Component({
    selector: 'app-community-messages',
    templateUrl: './community-messages.component.html',
    styleUrls: ['./community-messages.component.scss']
})
export class CommunityMessagesComponent implements OnInit {

    ownName = 'Random Person';

    messages: IMessageDisplay[] = [
        {
            sender: 'Baxter Cochennet',
            message: 'This is the first message of the chat'
        },
        {
            sender: 'Andrei Parrent',
            message: 'I am asking who can help with accounting'
        },
        {
            sender: 'Random Person',
            message: 'Baxter can help'
        },
        {
            sender: 'Baxter Cochennet',
            message: 'I can help'
        },
    ];

    constructor(private comService: CommunityService) { }

    ngOnInit() {
    }

    nameClick(name: string) {
        this.comService.updateSearch([name], []);
    }

}
interface IMessageDisplay {
    message: string;
    sender: string;
}