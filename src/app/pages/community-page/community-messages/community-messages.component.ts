import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommunityService } from '../../../shared/community/community.service';
import { CommunitySearchType, IUser } from '../../../shared/community/community-interfaces';
import { AuthService } from '../../../shared/auth/auth.service';
import { Observable } from '@firebase/util';
import { IMessage } from '../../../shared/community/chat.service';
import { IChat } from '../../../shared/community/ichat';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-community-messages',
    templateUrl: './community-messages.component.html',
    styleUrls: ['./community-messages.component.scss']
})
export class CommunityMessagesComponent implements OnInit, OnDestroy {

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
    /*
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
    */
    currentChat: IChat;
    chatSub: Subscription;

    constructor(private comService: CommunityService, private authService: AuthService) {
        comService.members.subscribe(members => {
            if (members.map(user => user.ref.id).includes(this.authService.token))
                this.isMember = true;
        });
        comService.messageRef.subscribe(ref => {
            if (ref)
                this.authService.getChat(ref).then(chat => {
                    this.currentChat = chat;
                });
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
    ngOnDestroy(): void {
        if (this.chatSub) {
            this.chatSub.unsubscribe();
            this.currentChat.unsubscribe();
        }
    }

}
interface IMessageDisplay {
    message: string;
    sender: string;
}