import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommunityService } from '../../../shared/community/community.service';
import { ICommunitySkills, IProfile } from '../../../shared/community/community-interfaces';

@Component({
    selector: 'app-community-skills',
    templateUrl: './community-skills.component.html',
    styleUrls: ['./community-skills.component.scss']
})
export class CommunitySkillsComponent implements OnInit {

    skills: ICommunitySkills[];
    @Output() communitySkills = new EventEmitter<number[]>();

    constructor(private comService: CommunityService) { }

    ngOnInit() {
        this.comService.members.subscribe(members => this.sortSkills(members));
        // this.comService.listenSkills().subscribe(skills => this.sortSkills(skills));
    }

    sortSkills(members: IProfile[]) {
        const comSkills: number[] = [];
        this.skills = [];
        members.forEach(member => {
            member.skills.forEach(skill => {
                if (!this.skills[skill]) {
                    this.skills[skill] = [];
                    comSkills[skill] = 0;
                }
                this.skills[skill].push(member);
                comSkills[skill]++;
            });
        });
        this.comService.skills = this.skills;
        this.communitySkills.emit(comSkills);
        this.skills.sort((a, b) => {
            if (a < b)
                return -1;
            if (a > b)
                return 1;
            return 1;
        });
        // skills.slice().sort((a, b) => {
        // })
        // this.skills

    }

}
