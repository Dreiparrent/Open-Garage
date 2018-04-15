import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './layouts/home/home.component';
import { SearchComponent } from './layouts/search/search.component';
import { LoginComponent } from './layouts/login/login.component';
import { RegisterComponent } from './layouts/register/register.component';
import { CommunityComponent } from './layouts/community/community.component';
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
    { path: '', component: HomeComponent, data: { title: 'Home' }, children: HOME_ROUTES},
    { path: '', component: SearchComponent, data: { title: 'Search' }, children: SEARCH_ROUTES, canActivate: [AuthGuard] },
    { path: '', component: LoginComponent, data: { title: 'Login' }, children: LOGIN_ROUTES },
    { path: '', component: RegisterComponent, data: { title: 'Login' }, children: REGISTER_ROUTES },
    { path: '', component: CommunityComponent, data: { title: 'Community' }, children: COMMUNITY_ROUTES },
    { path: '', component: CommunitiesComponent, data: {title: 'Communities'}, children: COMMUNITIES_ROUTES }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {

}