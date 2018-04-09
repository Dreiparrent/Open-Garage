import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../../shared/community/community.service';
import { ActivatedRoute } from '@angular/router';
import { ICommunityData, IProfile } from '../../shared/community/community-interfaces';


@Component({
    selector: 'app-community-page',
    templateUrl: './community-page.component.html',
    styleUrls: ['./community-page.component.scss']
})
export class CommunityPageComponent implements OnInit {
    community: ICommunityData;
    hasMembers = false;
    hasTops = false;
    hasMessages = false;
    communityMembers: IProfile[];
    topMembers: IProfile[];

    tmpPhoto = '/assets/img/photos/baxter.jpg';

    constructor(private comService: CommunityService, private route: ActivatedRoute) { }

    ngOnInit() {
        this.community = this.comService.getCommunityData(this.route.snapshot.params['id']);
        if (this.community.members.length > 0)
            this.sortMembers();
        if (this.community.messages.length > 0)
            this.getMessages();
    }

    sortMembers() {
        this.communityMembers = this.community.members.slice().sort((profile1, profile2) => {
            if (profile1.connections < profile2.connections)
                return 1;
            if (profile1.connections > profile2.connections)
                return -1;
            return 0;
        });
        this.topMembers = this.communityMembers.slice(0, 6);
        this.hasMembers = true;
        if (this.topMembers[0].connections > 0)
            this.hasTops = true;
        this.communityMembers.sort((profile1, profile2) => {
            if (profile1.name > profile2.name)
                return 1;
            if (profile1.name < profile2.name)
                return -1;
            return 0;
        });
    }

    getMessages() {
        this.hasMessages = true;
    }

}
