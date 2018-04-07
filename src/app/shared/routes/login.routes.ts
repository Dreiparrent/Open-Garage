import { Routes, RouterModule } from '@angular/router';

//Route for content layout without sidebar, navbar and footer for pages like Login, Registration etc...

export const LOGIN_ROUTES: Routes = [
    {
        path: 'login',
        loadChildren: './pages/login-page/login-pages.module#LoginPagesModule'
    }
];