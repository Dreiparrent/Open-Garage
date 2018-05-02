import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { LoginComponent } from './layouts/login/login.component';
import { RegisterComponent } from './layouts/register/register.component';
import { MainComponent } from './layouts/main/main.component';
import { CommunitiesComponent } from './layouts/communities/communities.component';

import { AuthGuard } from './shared/auth/auth-guard.service';

import { HOME_ROUTES } from './shared/routes/home.routes';
import { SEARCH_ROUTES } from './shared/routes/search.routes';
import { LOGIN_ROUTES } from './shared/routes/login.routes';
import { REGISTER_ROUTES } from './shared/routes/register.routes';
import { COMMUNITY_ROUTES } from './shared/routes/community.routes';
import { COMMUNITIES_ROUTES } from './shared/routes/communities.routes';

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    { path: '', component: MainComponent, data: { title: 'Home', side: false }, children: HOME_ROUTES},
    { path: '', component: MainComponent, data: { title: 'Search', side: false }, children: SEARCH_ROUTES, canActivate: [AuthGuard] },
    { path: '', component: LoginComponent, data: { title: 'Login', side: false }, children: LOGIN_ROUTES },
    { path: '', component: RegisterComponent, data: { title: 'Login', side: false }, children: REGISTER_ROUTES },
    { path: '', component: MainComponent, data: { title: 'Community', side: true }, children: COMMUNITY_ROUTES },
    { path: '', component: CommunitiesComponent, data: { title: 'Communities', side: false}, children: COMMUNITIES_ROUTES }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {

}