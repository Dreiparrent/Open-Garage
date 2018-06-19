import { Component, OnInit, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { NavigationService } from '../../../shared/navigation/navigation-service';
import { FormControl } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CommunityService } from '../../../shared/community/community.service';
import { CommunitySearchType, IUser, IUserData } from '../../../shared/community/community-interfaces';
import { ENTER } from '@angular/cdk/keycodes';
import { CommunitiesService, SimpleFilter } from '../../../shared/community/communities.service';

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
    filterOptions: (val?: string) => any;
    comSub: Subscription;
    currentValue = '';
    valueSub: Subscription;

    options: SearchOptions[] = [];

    constructor(private comService: CommunityService) {
        this.searchControl = new FormControl();
        // this.filterOptions = SimpleFilter().bind(this, this.options);
        // const filterOptions = SimpleFilter().bind(this, null, this.options);  // .bind(this, this.options);
        // this.filterOptions.bind(this);
        this.filterOptions = SimpleFilter(1, 5);
        this.filterOptions.bind(this);
        this.filteredOptions = this.searchControl.valueChanges.pipe(
            startWith(''),
            map(val => {
                if (val === '')
                    this.comService.updateSearch();
                else
                    this.currentValue = val;
                return val;
            }),
            map(param => param ? this.filterOptions(param) : []),
            map(opt => {
                this.sendSearch(opt);
                return opt;
            })
        );
    }

    ngOnInit(): void {
        this.comSub = this.comService.members.subscribe(members => this.setOptions(members));
        this.valueSub = this.comService.searchValue.subscribe(val => {
            if (this.currentValue !== val)
                this.search.nativeElement.value = this.currentValue = val;
        });
    }

    setOptions(members: IUser[]) {
        members.forEach(member => {
            this.options.push({ name: member.name, type: 0 });
            member.skills.forEach(skill => {
                const oSkill = { name: skill, type: 1 };
                if (!this.options.some(s => s.name.toLowerCase() === skill.toLowerCase()))
                    this.options.push(oSkill);
            });
        });
    }

    sendSearch(val: any[]) {
        let sendType = -1;
        const sendMembers = val.filter(o => o.type === 0).map(mem => mem.name);
        const sendSkills = val.filter(o => o.type === 1).map(mem => mem.name);
        if (sendMembers.length > 0 && sendSkills.length === 0)
            sendType = CommunitySearchType.members;
        else if (sendMembers.length === 0 && sendSkills.length > 0)
            sendType = CommunitySearchType.skills;
        this.comService.updateSearch(sendMembers, sendSkills, this.currentValue, sendType);
        return val;
    }

    ngOnDestroy() {
        this.comSub.unsubscribe();
        this.valueSub.unsubscribe();
    }

}
