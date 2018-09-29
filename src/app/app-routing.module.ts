import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './layouts/login/login.component';
import { RegisterComponent } from './layouts/register/register.component';
import { MainComponent } from './layouts/main/main.component';
import { CommunitiesComponent } from './layouts/communities/communities.component';

import { SEARCH_ROUTES } from './shared/routes/search.routes';
import { COMMUNITY_ROUTES } from './shared/routes/community.routes';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home', component: MainComponent, data: { title: 'Home', side: false },
        loadChildren: './pages/home-page/home-pages.module#HomePagesModule'
    },
    {
        path: 'login', component: LoginComponent, data: { title: 'Login', side: false },
        loadChildren: './pages/login-page/login-pages.module#LoginPagesModule' },
    {
        path: 'register', component: RegisterComponent, data: { title: 'Register', side: false },
        loadChildren: './pages/register-page/register-pages.module#RegisterPagesModule'
    },
    {
        path: 'community', pathMatch: 'full', component: CommunitiesComponent, data: { title: 'Communities', side: false },
        loadChildren: './pages/communities-pages/communities-pages.module#CommunitiesPagesModule'
    },
    {
        path: '', component: MainComponent, data: { title: 'Community', side: true },
        children: COMMUNITY_ROUTES
    },
    {
        path: '', component: MainComponent, data: { title: 'Search', side: false },
        children: SEARCH_ROUTES
    },
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {

}