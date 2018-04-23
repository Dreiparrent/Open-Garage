import { Component, Input, ViewChild, ElementRef } from '@angular/core';
import { CommunityService } from '../../community/community.service';
import { ICommunitySkills, IProfile } from '../../community/community-interfaces';

@Component({
    selector: 'app-skills-card',
    templateUrl: './skills-card.component.html',
    styleUrls: ['./skills-card.component.scss']
})
export class SkillsCardComponent {

    @Input('skill') skill: string;
    @Input('profiles') profiles: IProfile[];
    hoverNumber = -1;

    constructor(private comService: CommunityService) { }

    cardClick() {
        this.comService.updateSearch(this.profiles.map(p => p.name), [this.skill]);
    }
    nameClick(profile) {
        this.comService.updateSearch([profile], []);
    }

    mouseOver(i: number) {
        this.hoverNumber = i;
    }
    mouseOut(i: number) {
        this.hoverNumber = -1;
    }

}
