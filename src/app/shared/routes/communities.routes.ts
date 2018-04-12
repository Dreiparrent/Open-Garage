import { Routes, Route } from '@angular/router';

export const COMMUNITIES_ROUTES: Routes = [
    {
        path: 'community',
        loadChildren: './pages/communities-pages/communities-pages.module#CommunitiesPagesModule',
    }
];