import { Routes, RouterModule } from '@angular/router';

// Route for content layout without sidebar, navbar and footer for pages like Login, Registration etc...

export const REGISTER_ROUTES: Routes = [
    {
        path: 'register',
        loadChildren: '../../pages/register-page/register-pages.module#RegisterPagesModule'
        // loadChildren: './pages/register-page/register-pages.module#RegisterPagesModule'
    }
];