import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { CommunityService } from '../community/community.service';
import { IProfile, ICommunitySkills } from '../community/community-interfaces';
import { IPerfLoggingPrefs } from 'selenium-webdriver/chrome';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
    selector: 'app-skills-slider',
    templateUrl: './skills-slider.component.html',
    styles: [
        `#skillsTitle {
            margin-top: 1.25rem !important;
            margin-left: 1.25rem !important;
            margin-bottom: 1.5rem !important;
            margin-right: 1.25rem !important;
        }`
    ]
})
export class SkillsSliderComponent implements OnDestroy {

    topSkills: string[];
    skillsArray;
    colors = ['#911C5E', '#821D61', '#731F63', '#642066', '#562268', '#47236B', '#38256D', '#292670'];
    colors2 = ['#C88EAF', '#C18FB0', '#B98FB2', '#B290B3', '#AA91B4', '#A392B5', '#9B92B7', '#9493B8'];
    colors3 = ['#c88eaf', '#b2608e', '#a23e76', '#911c5e', '#891956', '#7e144c', '#741142', '#620931'];
    colors4 = ['#620931', '#741142', '#7e144c', '#891956', '#911c5e', '#a23e76', '#b2608e', '#c88eaf'];
    hideSkills = true;

    private _queryListener: () => void;
    mobileQuery: MediaQueryList;
    medQuery: MediaQueryList;
    largeQuery: MediaQueryList;
    tmpSkills; skillsNumber = 3;
    constructor(private changeDetectorRef: ChangeDetectorRef, private media: MediaMatcher) {
        this.createObservers();
    }

    createObservers() {
        this.mobileQuery = this.media.matchMedia('(max-width: 600px)');
        this._queryListener = () => {
            this.changeDetectorRef.detectChanges();
            if (this.skillsNumber !== this.getSkillsNumber()) {
                this.skillsNumber = this.getSkillsNumber();
                this.sortSkills(this.tmpSkills);
            }
        };
        this.mobileQuery.addListener(this._queryListener);
        if (this.skillsNumber !== this.getSkillsNumber())
            this.skillsNumber = this.getSkillsNumber();
    }

    sortSkills(skills: ISkills) {
        this.tmpSkills = skills;
        const uniques = [];
        // tslint:disable-next-line:curly
        for (const skill in skills) {
            if (skills.hasOwnProperty(skill))
                uniques.push(skill);
        }
        this.topSkills = [];
        this.topSkills = uniques.sort((a, b) => {
            return skills[b] - skills[a];
        }).slice(0, this.skillsNumber);
        this.countTopSkills(skills);
    }

    countTopSkills(frequencyList: {}) {
        const freqArray = {};
        let totalSkills = 0;
        this.topSkills.forEach(skill => {
            totalSkills += frequencyList[skill];
        });
        this.topSkills.forEach(skill => {
            const width = (frequencyList[skill] / totalSkills) * 100;
            freqArray[skill] = width;
        });
        this.skillsArray = freqArray;
    }
    getStyle(skill: string) {
        return this.skillsArray[skill] + '%';
    }
    getSkill(skill: string) {
        const skillPerc: number = this.skillsArray[skill];
        return Math.round(skillPerc * 10) / 10 + '%';
    }
    skillsClick() {
        this.hideSkills = !this.hideSkills;
    }
    getSkillsNumber(): number {
        if (this.mobileQuery.matches)
            return 3;
        return 6;
    }
    ngOnDestroy(): void {
        // Called once, before the instance is destroyed.
        // Add 'implements OnDestroy' to the class.
    }
}
interface ISkills {
    [index: string]: number;
}