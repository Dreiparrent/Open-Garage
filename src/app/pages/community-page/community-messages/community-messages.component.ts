import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../../../shared/community/community.service';
import { CommunitySearchType, IUser } from '../../../shared/community/community-interfaces';
import { AuthService } from '../../../shared/auth/auth.service';

@Component({
    selector: 'app-community-messages',
    templateUrl: './community-messages.component.html',
    styleUrls: ['./community-messages.component.scss']
})
export class CommunityMessagesComponent implements OnInit {

    ownName = 'Random Person';
    hoverNumber = -1;
    isMember = false;

    searchProfile: IUser = {
        name: '',
        location: '',
        connections: 0,
        imgUrl: '',
        skills: [],
        passions: [],
    };

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

    constructor(private comService: CommunityService, private authService: AuthService) {
        comService.members.subscribe(members => {
            if (members.filter(user => user.ref.id === this.authService.token).length > 0)
                this.isMember = true;
        });
    }

    ngOnInit() {
    }

    nameClick(name: string) {
        this.comService.updateSearch([name], [], name, CommunitySearchType.messageMembers);
    }

    mouseOver(i: number, name?: string) {
        this.hoverNumber = i;
        // TODO: fix this to use actual profile data if chosen
        if (name)
            this.searchProfile = this.comService.getMembers('fake').find(p => p.name === name);
        // $(this.profileElem.children[i]).addClass('text-primary');
    }
    mouseOut(i: number) {
        this.hoverNumber = -1;
    }

}
interface IMessageDisplay {
    message: string;
    sender: string;
}