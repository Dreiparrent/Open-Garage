import { Component, OnInit } from '@angular/core';
import { CommunityService } from '../community/community.service';
import { IProfile, ISkills } from '../community/community-interfaces';
import { IPerfLoggingPrefs } from 'selenium-webdriver/chrome';

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
export class SkillsSliderComponent implements OnInit {

    private _currentSkills: ISkills[];
    communitySkills: string[];
    topSkills: string[];
    skillsArray;
    colors = ['#911C5E', '#821D61', '#731F63', '#642066', '#562268', '#47236B', '#38256D', '#292670'];
    colors2 = ['#C88EAF', '#C18FB0', '#B98FB2', '#B290B3', '#AA91B4', '#A392B5', '#9B92B7', '#9493B8'];
    colors3 = ['#c88eaf', '#b2608e', '#a23e76', '#911c5e', '#891956', '#7e144c', '#741142', '#620931'];
    colors4 = ['#620931', '#741142', '#7e144c', '#891956', '#911c5e', '#a23e76', '#b2608e', '#c88eaf'];
    hideSkills = true;
    constructor(private comService: CommunityService) { }

    ngOnInit() {
        this.comService.currentMembers.subscribe(members => this.sortSkills(members));
    }

    sortSkills(members: IProfile[]) {
        this._currentSkills = [];
        this.communitySkills = [];
        members.forEach((member: IProfile) => {
            this._currentSkills.push({ [member.name]: member.skills });
            this.communitySkills = this.communitySkills.concat(member.skills);
        });
        this.comService.skills = this._currentSkills;
        const freqArray = this.getTopSkills();
        this.countTopSkills(freqArray);
    }
    getTopSkills(): {} {
        const freqArray = {};
        const frequency = {};
        this.communitySkills.forEach(skill => {
            freqArray[skill] = 0;
            frequency[skill] = 0;
        });
        const uniques = this.communitySkills.filter((skill) => {
            freqArray[skill]++;
            return ++frequency[skill] === 1;
        });

        this.topSkills = uniques.sort((a, b) => {
            return frequency[b] - frequency[a];
        }).slice(0, 6);
        return freqArray;
    }

    countTopSkills(frequencyList: {}) {
        const freqArray = {};
        // const freqNumbers: number[] = Object.values(frequencyList);
        // const totalSkills = freqNumbers.reduce((a, b) => a + b);
        let totalSkills = 0;
        this.topSkills.forEach(skill => {
            totalSkills += frequencyList[skill];
        });
        this.topSkills.forEach(skill => {
            const width = (frequencyList[skill] / totalSkills) * 100;
            freqArray[skill] = width;
        });
        this.skillsArray = freqArray;
        console.log(this.skillsArray);
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
}