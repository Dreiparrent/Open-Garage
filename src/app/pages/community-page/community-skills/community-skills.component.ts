import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommunityService } from '../../../shared/community/community.service';
import { ICommunitySkills, IProfile } from '../../../shared/community/community-interfaces';
import { NgxCarousel, NgxCarouselStore } from 'ngx-carousel';

@Component({
    selector: 'app-community-skills',
    templateUrl: './community-skills.component.html',
    styleUrls: ['./community-skills.component.scss'],
    styles: [`
        .bannerStyle {
            background-color: #ccc;
            min-height: 300px;
            text-align: center;
            line-height: 300px;
        }
    `]
})
export class CommunitySkillsComponent implements OnInit {

    insertSkills: string[];
    carousel: NgxCarousel;
    skills: ICommunitySkills[];
    @Output() communitySkills = new EventEmitter<number[]>();

    constructor(private comService: CommunityService) { }

    ngOnInit() {
        this.carousel = {
            grid: { xs: 1, sm: 2, md: 3, lg: 4, all: 0 },
            // slide: 1,
            speed: 400,
            // interval: 4000,
            point: {
                visible: true
            },
            load: 2,
            touch: true,
            loop: true,
            custom: 'banner'
        };
        this.comService.members.subscribe(members => this.sortSkills(members));
    }

    sortSkills(members: IProfile[]) {
        console.log('sort');
        const comSkills: number[] = [];
        this.skills = [];
        const inSkills = [];
        members.forEach(member => {
            member.skills.forEach(skill => {
                if (!this.skills[skill]) {
                    inSkills.push(skill);
                    this.skills[skill] = [];
                    comSkills[skill] = 0;
                }
                this.skills[skill].push(member);
                comSkills[skill]++;
            });
        });
        this.comService.skills = this.skills;
        this.communitySkills.emit(comSkills);
        this.insertSkills = inSkills.sort();
    }

    public cLoad(event: Event) {
        // console.log('test');
        // console.log(event);
        // carouselLoad will trigger this funnction when your load value reaches
        // it is helps to load the data by parts to increase the performance of the app
        // must use feature to all carousel
    }
}
