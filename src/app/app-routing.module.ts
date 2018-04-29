import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { MainComponent } from './layouts/main/main.component';
import { LoginComponent } from './layouts/login/login.component';
import { RegisterComponent } from './layouts/register/register.component';
import { CommunityGuardService } from './shared/community/community-guard.service';
import { CommunityPathMatcher } from './shared/routes/community-path-matcher';

import { AuthGuard } from './shared/auth/auth-guard.service';

/*
// import { HOME_ROUTES } from './shared/routes/home.routes';
// import { HOME_ROUTES } from './pages/home-page/home.routes';
import { SEARCH_ROUTES } from './shared/routes/search.routes';
import { LOGIN_ROUTES } from './shared/routes/login.routes';
import { REGISTER_ROUTES } from './shared/routes/register.routes';
import { COMMUNITY_ROUTES } from './shared/routes/community.routes';
import { COMMUNITIES_ROUTES } from './shared/routes/communities.routes';
*/

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    {
        path: 'home', component: MainComponent, data: { side: false },
        loadChildren: './pages/home-page/home-pages.module#HomePagesModule'
    },
    {
        path: 'search', component: MainComponent, data: { side: false },
        loadChildren: './pages/search-page/search-pages.module#SearchPagesModule', canActivate: [AuthGuard]
    },
    {
        path: 'login', component: LoginComponent,
        loadChildren: './pages/login-page/login-pages.module#LoginPagesModule'
    },
    {
        path: 'register', component: RegisterComponent, data: { title: 'Register' },
        loadChildren: './pages/register-page/register-pages.module#RegisterPagesModule'
    },
    {
        // path: 'community',
        component: MainComponent,
        data: { side: true },
        loadChildren: './pages/community-page/community-pages.module#CommunityPagesModule',
        canActivate: [CommunityGuardService],
        matcher: CommunityPathMatcher.pathMatcher
    },
    {
        path: '', component: MainComponent, data: { side: false },
        loadChildren: './pages/communities-pages/communities-pages.module#CommunitiesPagesModule'
    }
];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {

}