import { Component, OnInit } from '@angular/core';
import { SwUpdateService } from './sw-update.service';
import { environment } from '../environments/environment.prod';

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

        const link = document.createElement('link');
        link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
        link.rel = 'stylesheet';
        link.type = 'text/css';
        const style = head.getElementsByTagName('style')[0];

        head.insertBefore(link, style);
<<<<<<< HEAD
        /*
=======

>>>>>>> a318778de48355fce8f0c7dbc2119aae429c540a
        if (environment.production) {
            const link2 = document.createElement('link');
            // link2.href =
            link2.href = 'app*.css';
            link2.rel = 'stylesheet';
            link2.type = 'text/css';
            head.insertBefore(link2, style);
        }
<<<<<<< HEAD
        */
    }
    /*
=======
    }

>>>>>>> a318778de48355fce8f0c7dbc2119aae429c540a
    loadScript(scriptUrl: string) {
        const script = document.createElement('script');
        script.src = scriptUrl;
        document.body.appendChild(script);
    }
<<<<<<< HEAD
    */
=======
>>>>>>> a318778de48355fce8f0c7dbc2119aae429c540a
}
