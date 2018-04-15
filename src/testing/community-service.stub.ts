import { ICommunity, ICommunityData, IProfile, IMessage, ICommunitySkills } from '../app/shared/community/community-interfaces';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Subject } from 'rxjs/Subject';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';

export class CommunityServiceStub {
    getCommunities(uid: string): ICommunity[] {
        return [];
    }

    init(id: string): BehaviorSubject<string> { return new BehaviorSubject('test'); }
    set communityID(id: string) { }
    get communityID(): string { return 'test'; }

    set community(community: ICommunityData) { }
    get community(): ICommunityData {
        const comData = <ICommunityData>{ name: 'Test Community' };
        return comData;
    }


    // Community variables
    get name(): string { return 'test'; }
    get members(): BehaviorSubject<IProfile[]> {
        return new BehaviorSubject<IProfile[]>([]);
    }
    get messages(): Observable<IMessage[]> {
        return of([]);
    }
    set showWeb(show: boolean) { }
    set skills(skills: ICommunitySkills[]) { }
    get skills(): ICommunitySkills[] { return []; }

    // Firebase
    getCommunity(id?: string): boolean {
        return true;
    }
    getCommunityData(id?: string) {
        const comData = <ICommunityData>{};
        return comData;
    }

    // Helpers
    makeSmall(isSmall: boolean) { }
    isSmall(): Observable<boolean> { return of(false); }
}