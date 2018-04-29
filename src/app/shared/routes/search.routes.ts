import { Routes, RouterModule } from '@angular/router';

// Route for content layout without sidebar, navbar and footer for pages like Login, Registration etc...

export const SEARCH_ROUTES: Routes = [
    {
        path: 'search',
        loadChildren: '../../pages/search-page/search-pages.module#SearchPagesModule'
        // loadChildren: './pages/search-page/search-pages.module#SearchPagesModule'
    }
];