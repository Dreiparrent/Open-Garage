import { Component, OnInit } from '@angular/core';
import { CommunitiesService, ISearch, SimpleFilter } from '../../shared/community/communities.service';
import { Router } from '@angular/router';
import { map, flatMap, mapTo, reduce, switchMap, concatAll, catchError, startWith, mergeMap } from 'rxjs/operators';
import { forkJoin } from 'rxjs/observable/forkJoin';
import { ICommunity, IUser } from '../../shared/community/community-interfaces';
import { Observable, Subject, pipe, from, of } from 'rxjs';
// import { mergeMap } from 'rxjs/operators';
import { FormControl } from '@angular/forms';
import { IExploreUser } from '../../shared/cards/explore-card/explore-card.component';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss']
})
export class HomePageComponent implements OnInit {

    model = {
        left: true,
        middle: false,
        right: false
    };
    getStarted: IGetStarted[] = [
        {
            id: 'sProfile',
            icon: 'person',
            h: 'Profile',
            h2: `Create your profile`,
            t: [`Fill out your profile with the skills and passions that you have to share with your community.`],
            t2: [
                `List out your skills (sewing, ski waxing, saxophone, shoe tieing, etc)`,
                `List out your passions (cycling, fishing, baking, poker, etc)`,
                `What do you charge for your time?
                 We’re not trying to facilitate hustling your neighbor, and encourage you to simply help one another out.
                 However, we know your time is valuable, so we allow you to choose between your preferred method of compensation.
                 We chose these categories intentionally, so that you can continue to get to know your neighbors over a slice or a pint.
                 Not really feeling the vibe? Feel free to negotiate a fair price or trade.`,
                `Tell us a bit about yourself`
            ],
            active: false
        },
        {
            id: 'sSearch',
            icon: 'search',
            h: 'Search',
            h2: `Search your community for a skill or a passion`,
            t: [`Skis need waxed? Can't get those numbers to balance? Search your local community to see who can help.`],
            t2: [
                `What do you need? What are you looking to learn?`,
                `Find people in your community who offer what you are looking for, and reach out!
                 Send them a message to see if they can lend a hand (or bike pump, or an Excel formula….)`
            ],
            active: false
        },
        {
            id: 'sConnect',
            icon: 'people',
            h: 'Connect',
            h2: `Learn from those around you`,
            t: [`Connect offline to teach a skill, learn a new hobby, and find immediate solutions to your needs.`],
            t2: [
                `Make a connection and learn something new`,
                `Review your new connection based on how your interaction went.
                 The integrity of the system depends on trustworthiness, and trustworthiness is formed based
                 on how community members have rated the interactions they’ve had.`
            ],
            active: false
        },
        {
            id: 'sGraduate',
            icon: 'star',
            h: 'Graduate',
            h2: `Repeat!`,
            t: [`Fixing a flat tire probably costs a high-five, maybe a beer.
                Teaching an instrument? Sounds like you found your side hustle.`],
            t2: [
                `Share more, see more, do more, be more. Open Garage.`
            ],
            active: false
        }
    ];
    preFlexBasis: string;
    preMaxWidth: string;
    searchControl: FormControl;

    autoComplete: Observable<any[]>;
    filterOptions: (val?: string) => any;

    exploreUsers: IExploreUser[] = [
        {
            name: 'Baxter Cochennet',
            imgUrl: '/assets/img/photos/baxter.jpg',
            skpa: 'Cycling',
            com: 'Test Community',
            type: 0
        },
        {
            name: 'Baxter Cochennet',
            imgUrl: '/assets/img/photos/baxter.jpg',
            skpa: 'Cycling',
            com: 'Test Community',
            type: 0
        }
    ];

    // pointerState = ''
    constructor(private router: Router, private comsService: CommunitiesService) {
        this.searchControl = new FormControl();
        this.searchControl.valueChanges.pipe(
            startWith(''),
            map(val => this.comsService.search(val))
        ).subscribe();
        this.autoComplete = this.comsService.getSearch().pipe();
    }

    ngOnInit() {
        $('.bounce').on('click', event => {
            event.preventDefault();
        });
    }

    scrollTo(elem) {
        $('html, body').animate({
            scrollTop: $(elem).offset().top
        }, 800, () => {
            window.location.hash = elem;
        });
    }

    onSelected(search: string) {
        this.router.navigate(['/search'], {
            queryParams: {
                search: search
            }
        });
    }

    sClick(index: number) {
        const elem = this.getStarted[index].id;
        if (!this.preFlexBasis) {
            this.preFlexBasis = $(`#${elem}`).css('flex-basis');
            this.preMaxWidth = $(`#${elem}`).css('max-width');
        }
        Array.from($('#startedList').children())
            .filter(child => child.classList.contains('cursor-pointer'))
            .forEach(child => {
                const gIndex = this.getStarted.findIndex(g => g.id === child.id);
                if (child.classList.contains('active')) {
                    this.getStarted[gIndex].active = false;
                    $(child).animate({
                        flexBasis: this.preFlexBasis,
                        maxWidth: this.preMaxWidth
                    }, 300);
                } else if (child.id === elem) {
                    this.getStarted[gIndex].active = true;
                    $(child).animate({
                        flexBasis: '100%',
                        maxWidth: '100%'
                    }, 300);
                }
        });
    }
}
interface IGetStarted {
    id: string;
    icon: string;
    h: string;
    h2: string;
    t: string[];
    t2: string[];
    active: boolean;
}