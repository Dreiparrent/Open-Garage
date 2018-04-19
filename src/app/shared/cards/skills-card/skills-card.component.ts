import { Component, Input } from '@angular/core';
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

    constructor(private comService: CommunityService) { }

    cardClick() {
        this.comService.updateSearch(this.profiles.map(p => p.name), [this.skill]);
    }
    nameClick(profile) {
        this.comService.updateSearch([profile], []);
    }

}
