import { Routes, RouterModule } from '@angular/router';

export const LOGIN_ROUTES: Routes = [
    {
        path: 'login',
        loadChildren: '../../pages/login-page/login-pages.module#LoginPagesModule'
        // loadChildren: './pages/login-page/login-pages.module#LoginPagesModule'
    }
];