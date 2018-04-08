import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss']
})
export class RegisterPageComponent implements OnInit {

    @ViewChild('steep') stepElem: ElementRef;

    payments: string[] = [
        'Nothing, happy to help',
        'Pizza',
        'Tacos',
        'Beer (must be 21)',
        'Wine (must be 21)',
        'Cash'
    ];

    popovers = [
        `What can you help people with? Look, you don't have to be certified or have a gold medal to
         help someone out. We're just looking for something you know a lot about.
         Do you......cook? Run? Knit? Read about bitcoin? Build bikes? Follow fashion trends?
         Responsibly manage your finances? Meditate? Sketch? Take wicked photographs? Code? Wax your own
         skis? Maintenance your own car? I think you get the idea....`,
        `What do you daydream about at work? What do you spend your weekends doing in your garage?`,
        `What will you charge your community for sharing your knowledge? (quantity dependent on extent of knowledge shared)`,
        `Who are you? What's your fun fact? What should your community know about you?`
    ];

    constructor() {
        $.getScript('/assets/js/jquery.steps.js');
        $.getScript('/assets/js/wizard-steps.js');
    }

    ngOnInit() {
    }

}
