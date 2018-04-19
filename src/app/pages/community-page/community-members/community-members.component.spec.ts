import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityMembersComponent } from './community-members.component';
import { IProfile } from '../../../shared/community/community-interfaces';
import { CUSTOM_ELEMENTS_SCHEMA, Component, Input, DebugElement } from '@angular/core';
import { NavigationService } from '../../../shared/navigation/navigation-service';
import { CommunityService } from '../../../shared/community/community.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { BehaviorSubject, Subject } from 'rxjs';
import { By } from '@angular/platform-browser';

@Component({
    selector: 'app-profile-card', template: '<h3>{{name}}</h3><span>{{connections}}</span>'})
// tslint:disable-next-line:component-class-suffix
export class StubAppCard {
    @Input('name') name: string;
    @Input('connections') connections: string;
}

describe('CommunityMembersComponent', () => {
    let component: CommunityMembersComponent;
    let fixture: ComponentFixture<CommunityMembersComponent>;
    let firstCard: DebugElement;
    let element: HTMLElement;
    let mockComService;
    let _searchMembers;

    const testMembersArray: IProfile[] = [
        <IProfile>{
            name: 'Name 1',
            location: 'Location 1',
            connections: 1,
            imgUrl: 'testUrl1'
        },
        <IProfile>{
            name: 'Name 2',
            location: 'Location 2',
            connections: 2,
            imgUrl: 'testUrl2'
        },
        <IProfile>{
            name: 'Name 3',
            location: 'Location 3',
            connections: 3,
            imgUrl: 'testUrl3'
        }
    ];

    beforeEach(async(() => {
        const mockNavService = {};
        _searchMembers = new Subject<string[]>();
        mockComService = {
            get members() {
                return new BehaviorSubject<IProfile[]>(testMembersArray);
            },
            set members(mems) {
            },
            get searchMembers() {
                return _searchMembers;
            },
            set searchMembers(sm) {
                _searchMembers.next(sm);
            },
            makeSmall: (isSmall: boolean) => {}
        };
        const mockMedia = jasmine.createSpyObj('Media', ['matchMedia']);
        mockMedia.matchMedia.and.returnValue(<MediaQueryList>{
            addListener: (litener) => { },
            removeListener: (listener) => {}
        });
        TestBed.configureTestingModule({
            declarations: [CommunityMembersComponent, StubAppCard],
            providers: [
                { provide: CommunityService, useValue: mockComService},
                { provide: NavigationService, useValue: mockNavService},
                { provide: MediaMatcher, useValue: mockMedia}
            ],
            schemas: [CUSTOM_ELEMENTS_SCHEMA],
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(CommunityMembersComponent);
        component = fixture.componentInstance;
        firstCard = fixture.debugElement.query(By.css('app-profile-card'));
        element = fixture.nativeElement;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('Sort Members', () => {

        it('should set correct (local) memebers', () => {
            expect(component.communityMembers).toContain(testMembersArray[0]);
            expect(component.communityMembers).toContain(testMembersArray[1]);
            expect(component.communityMembers).toContain(testMembersArray[2]);
        });
        // add test members for sorting/binding tops
        testMembersArray.push(<IProfile>{ name: 'test 4', connections: 26 });
        testMembersArray.push(<IProfile>{ name: 'test 5', connections: 25 });
        testMembersArray.push(<IProfile>{ name: 'test 6', connections: 24 });
        testMembersArray.push(<IProfile>{ name: 'test 7', connections: 23 });
        testMembersArray.push(<IProfile>{ name: 'test 8', connections: 22 });
        testMembersArray.push(<IProfile>{ name: 'test 9', connections: 21 });
        testMembersArray.push(<IProfile>{ name: 'test 10', connections: 20 });

        it('should sort correct members', () => {
            fixture.detectChanges();
            expect(component.topMembers[0].name).toEqual('test 4');
        });

        it('should bind top members', () => {
            fixture.detectChanges();
            expect(element.getElementsByTagName('app-profile-card')[0].children[0].textContent).toEqual('test 4');
            expect(element.getElementsByTagName('app-profile-card')[0].children[1].textContent).toEqual('26');
        });

        it('should display 8 members', () => {
            expect(element.getElementsByTagName('app-profile-card').length).toEqual(8);
        });
        it('should display 6 members', () => {
            spyOn(component, 'getCardNumber').and.returnValue(6);
            component.sortMembers();
            fixture.detectChanges();
            expect(element.getElementsByTagName('app-profile-card').length).toEqual(6);
        });
        it('should display 3 members', () => {
            spyOn(component, 'getCardNumber').and.returnValue(3);
            component.sortMembers();
            fixture.detectChanges();
            expect(element.getElementsByTagName('app-profile-card').length).toEqual(3);
        });
        it('should have 1 search member', () => {
            mockComService.searchMembers = ['test 4'];
            fixture.detectChanges();
            expect(element.getElementsByTagName('app-profile-card').length).toEqual(1);
        });
        it('shoudl bind seach members', () => {
            mockComService.searchMembers = ['test 4'];
            fixture.detectChanges();
            expect(element.getElementsByTagName('app-profile-card')[0].children[0].textContent).toEqual('test 4');
            expect(element.getElementsByTagName('app-profile-card')[0].children[1].textContent).toEqual('26');
        });
    });
});
