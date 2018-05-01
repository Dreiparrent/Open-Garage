import { Component, OnInit } from '@angular/core';
import { SwUpdateService } from './sw-update.service';
import { environment } from '../environments/environment.prod';
// import '../assets/css/bootstrap.min.css';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
    title = 'app';
    constructor(private updates: SwUpdateService) {
    }

    ngOnInit() {
        const head = document.getElementsByTagName('head')[0];
        const style = head.getElementsByTagName('style')[0];

        const link1 = document.createElement('link');
        link1.href = 'https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0/css/bootstrap.min.css';
        link1.rel = 'stylesheet';
        head.insertBefore(link1, style);

        const link2 = document.createElement('link');
        link2.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
        link2.rel = 'stylesheet';
        head.insertBefore(link2, style);
        // head.innerHTML += '<link rel="preload" href="https://fonts.googleapis.com/icon?family=Material+Icons" as="style">';
        /*
        if (environment.production) {
            const link2 = document.createElement('link');
            // link2.href =
            link2.href = 'app*.css';
            link2.rel = 'stylesheet';
            link2.type = 'text/css';
            head.insertBefore(link2, style);
        }
        */
    }

    loadScript(scriptUrl: string) {
        const script = document.createElement('script');
        script.src = scriptUrl;
        document.body.appendChild(script);
    }
}
