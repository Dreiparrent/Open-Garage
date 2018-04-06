import { NgModule } from '@angular/core';
import { RouterModule, Routes, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './layouts/home/home.component'

import { AuthGuard } from './shared/auth/auth-guard.service';


import { HOME_ROUTES } from "./shared/routes/home.routes";

const appRoutes: Routes = [
    {
        path: '',
        redirectTo: 'home',
        pathMatch: 'full',
    },
    { path: '', component: HomeComponent, data: { title: 'full Views' }, children: HOME_ROUTES, canActivate: [AuthGuard] },

];

@NgModule({
    imports: [RouterModule.forRoot(appRoutes)],
    exports: [RouterModule]
})

export class AppRoutingModule {

}