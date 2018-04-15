import { Component, Input, NgModule } from '@angular/core';

/* tslint:disable */
@Component({ selector: 'app-nav', template: '', host: { sidenav: 'sidenav' } })
export class StubSideNav {
    @Input('sidenav') sidenav;
    @Input('comnav') comnav;
}
@Component({ selector: 'app-nav-button', template: '' })
export class StubNavButton { }
@Component({ selector: 'app-community-sidenav', template: '' })
export class StubComNav {
    @Input('comnav') comnav;
}
@Component({ selector: 'router-outlet', template: '' })
export class ROComponent { }
@Component({ selector: 'mat-sidenav', template: '' })
export class StubSN { }
@Component({ selector: 'mat-sidenav-content', template: '' })
export class StubSNContent {
}
@Component({ selector: 'mat-sidenav-container', template: '' })
export class StubSNContainer {
}
/* tslint:enable */
@NgModule({
    declarations: [
        StubSideNav,
        StubNavButton,
        StubComNav,
        ROComponent,
        StubSN,
        StubSNContent,
        StubSNContainer
    ],
    exports: [
        StubSideNav,
        StubNavButton,
        StubComNav,
        ROComponent,
        StubSN,
        StubSNContent,
        StubSNContainer
    ]
})
export class LayoutStubsModule {}