import { Component, OnInit, Input } from '@angular/core';
import { CommunityService } from '../../community/community.service';
import { ICommunitySkills, IProfile } from '../../community/community-interfaces';

@Component({
    selector: 'app-skills-card',
    templateUrl: './skills-card.component.html',
    styleUrls: ['./skills-card.component.scss']
})
export class SkillsCardComponent implements OnInit {

    @Input('skill') skill: string;
    @Input('profiles') profiles: IProfile[];

    constructor() { }

    ngOnInit() {
        // console.log(this.skill, this.profiles);
    }

}
