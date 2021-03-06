import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommunitiesService, ISearch, SimpleFilter } from '../../shared/community/communities.service';
import { Router } from '@angular/router';
import { map, startWith } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { FormControl } from '@angular/forms';
import { IExploreUser } from '../../shared/cards/explore-card/explore-card.component';
import { state, trigger, style, transition, animate } from '@angular/animations';

@Component({
    selector: 'app-home-page',
    templateUrl: './home-page.component.html',
    styleUrls: ['./home-page.component.scss'],
    animations: [
        trigger('heroState', [
            state('inactive', style({
                backgroundColor: 'rgba(0, 0, 0, 0)',
                // color: 'black'
            })),
            state('active', style({
                backgroundColor: 'rgba(58, 30, 46, 1)',
                color: '#c88aaf'
            })),
            transition('inactive => active', animate('500ms ease-in')),
            transition('active => inactive', animate('500ms ease-out'))
        ])
    ]
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

    // state = 'inactive';
    state = 'inactive';

    autoComplete: Observable<any[]>;
    filterOptions: (val?: string) => any;

    @ViewChild('exploreSec') exploreSec: ElementRef<HTMLElement>;

    exploreUsers: IExploreUser[] = [
        {
            name: 'Baxter Cochennet',
            imgUrl: '/assets/img/photos/baxter.jpg',
            skpa: '',
            com: 'Test Community',
            type: 1,
            state: 'inactive-true'
        },
        {
            name: 'Andrei Parrent',
            imgUrl: '/assets/img/photos/andrei.jpg',
            skpa: 'Fly Fishing',
            com: 'Test Community',
            type: 0,
            state: 'inactive-false'
        },
        {
            name: 'Baxter Cochennet',
            imgUrl: '/assets/img/photos/placeholder.gif',
            skpa: 'Web Design',
            com: 'Test Community',
            type: 0,
            state: 'inactive-true'
        },
        {
            name: 'Andrei Parrent',
            imgUrl: '/assets/img/photos/placeholder.gif',
            skpa: 'Finance',
            com: '',
            type: -1,
            state: 'inactive-false'
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
        // window.addEventListener('scroll', this.onScroll.bind(this));
    }

    scrollTo(elem) {
        $('html, body').animate({
            scrollTop: $(elem).offset().top
        }, 800, () => {
            window.location.hash = elem;
        });
    }

    onScroll() {
        console.log(this, this.exploreSec);
        if (document.documentElement.scrollTop + document.documentElement.clientHeight > this.exploreSec.nativeElement.offsetTop)
            // $(this.exploreSec.nativeElement).css('background-color', 'black');
            $(this.exploreSec.nativeElement).animate({
                backgroundColor: '#FFF000'
            }, 1000);
        else $(this.exploreSec.nativeElement).css('background-color', 'white');
    }
    onAppear(evt: boolean) {
        this.state = evt ? 'active' : 'inactive';
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