import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NavigationService } from '../../../shared/navigation/navigation-service';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommunityService } from '../../../shared/community/community.service';
import { IProfile } from '../../../shared/community/community-interfaces';
import { ENTER } from '@angular/cdk/keycodes';

export class SearchOptions {
    constructor(public name: string, public type: number) { }
}

@Component({
    selector: 'app-community-jumbotron',
    templateUrl: './community-jumbotron.component.html',
    styleUrls: ['./community-jumbotron.component.scss']
})
export class CommunityJumbotronComponent implements OnInit, OnDestroy {

    @ViewChild('jumbotron') jumbotron: ElementRef;

    searchControl: FormControl;

    filteredOptions: Observable<any[]>;
    comSub: Subscription;

    options: SearchOptions[] = [];

    constructor(private comService: CommunityService) {
        this.searchControl = new FormControl();
        this.filteredOptions = this.searchControl.valueChanges.pipe(
            startWith(''),
            map(param => param ? this.filterOptions(param) : [])
        );
    }

    ngOnInit(): void {
        this.comSub = this.comService.members.subscribe(members => this.setOptions(members));
    }

    setOptions(members: IProfile[]) {
        members.forEach(member => {
            this.options.push({ name: member.name, type: 0 });
            member.skills.forEach(skill => {
                const oSkill = { name: skill, type: 1 };
                if (!this.options.some(s => s.name.toLowerCase() === skill.toLowerCase()))
                    this.options.push(oSkill);
            });
        });
    }

    filterOptions(param: string) {
        return this.options.filter(option => option.name.toLowerCase().indexOf(param.toLowerCase()) === 0).slice(0, 5);
    }

    onKeyup(value: string) {
        if (value === '') {
            this.comService.updateSearch([], []);
            return;
        }
        const sendMembers = [];
        const sendSkills = [];
        this.filterOptions(value).forEach(val => {
            if (val.type === 0)
                if (!sendMembers.includes(val.name))
                    sendMembers.push(val.name);
            if (val.type === 1)
                if (!sendSkills.includes(val.name))
                    sendSkills.push(val.name);
        });
        this.comService.updateSearch(sendMembers, sendSkills);
    }

    ngOnDestroy() {
        this.comSub.unsubscribe();
    }

}
