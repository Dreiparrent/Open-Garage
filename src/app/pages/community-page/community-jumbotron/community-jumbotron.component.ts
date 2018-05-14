import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NavigationService } from '../../../shared/navigation/navigation-service';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommunityService } from '../../../shared/community/community.service';
import { IProfile, CommunitySearchType } from '../../../shared/community/community-interfaces';
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
    @ViewChild('search') search: ElementRef;

    searchControl: FormControl;

    filteredOptions: Observable<any[]>;
    comSub: Subscription;
    currentValue = '';
    valueSub: Subscription;

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
        this.valueSub = this.comService.searchValue.subscribe(val => {
            if (this.currentValue !== val)
                this.search.nativeElement.value = this.currentValue = val;
        });
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
            this.comService.updateSearch();
            return;
        }
        this.currentValue = value;
        const sendMembers = [];
        const sendSkills = [];
        let sendType = -1;
        this.filterOptions(value).forEach(val => {
            if (val.type === 0)
                if (!sendMembers.includes(val.name))
                    sendMembers.push(val.name);
            if (val.type === 1)
                if (!sendSkills.includes(val.name))
                    sendSkills.push(val.name);
        });
        if (sendMembers.length > 0 && sendSkills.length === 0)
            sendType = CommunitySearchType.members;
        else if (sendMembers.length === 0 && sendSkills.length > 0)
            sendType = CommunitySearchType.skills;
        this.comService.updateSearch(sendMembers, sendSkills, value, sendType);
    }

    ngOnDestroy() {
        this.comSub.unsubscribe();
        this.valueSub.unsubscribe();
    }

}
