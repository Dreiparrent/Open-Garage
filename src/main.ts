import './polyfills';
import './styles.scss';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
// import { platformBrowser } from '@angular/platform-browser';

// import './assets/sass/app.scss';

// tslint:disable-next-line:curly
// if (process.env.ENV === 'production') {
    enableProdMode();
    // require('zone.js/dist/zone');
// }
platformBrowserDynamic().bootstrapModule(AppModule)
.catch(err => console.log(err));