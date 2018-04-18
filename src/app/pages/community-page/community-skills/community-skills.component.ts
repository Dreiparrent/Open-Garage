import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { CommunityService } from '../../../shared/community/community.service';
import { ICommunitySkills, IProfile } from '../../../shared/community/community-interfaces';
import { NgxCarousel, NgxCarouselStore } from 'ngx-carousel';
import { Subscription } from 'rxjs';

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
export class CommunitySkillsComponent implements OnInit, OnDestroy {

    carousel: NgxCarousel;
    @Output() communitySkills = new EventEmitter<number[]>();
    insertSkills: string[];
    tmpSkills: ICommunitySkills[] = [];
    tmpInsert: string[];
    skills: ICommunitySkills[] = [];
    membersSub: Subscription;
    searchSub: Subscription;

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
        this.membersSub = this.comService.members.subscribe(members => this.sortSkills(members));
        this.searchSub = this.comService.searchSkills.subscribe(skills => this.searchSkills(skills));
    }

    sortSkills(members: IProfile[]) {
        console.log('sort');
        const comSkills: number[] = [];
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
        this.tmpSkills = this.skills;
        this.comService.skills = this.skills;
        this.communitySkills.emit(comSkills);
        this.tmpInsert = inSkills.sort();
        this.insertSkills = this.tmpInsert;
    }

    searchSkills(seachSkills: string[]) {
        this.skills = [];
        this.insertSkills = [];
        // tslint:disable-next-line:curly
        if (seachSkills.length > 0) {
            seachSkills.forEach(skill => {
                this.skills[skill] = this.tmpSkills[skill];
                this.insertSkills.push(skill);
            });
        } else {
            this.skills = this.tmpSkills;
            this.insertSkills = this.tmpInsert;
        }
    }

    public cLoad(event: Event) {
        // console.log('test');
        // console.log(event);
        // carouselLoad will trigger this funnction when your load value reaches
        // it is helps to load the data by parts to increase the performance of the app
        // must use feature to all carousel
    }

    ngOnDestroy() {
        this.membersSub.unsubscribe();
        this.searchSub.unsubscribe();
    }
}
