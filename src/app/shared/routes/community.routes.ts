import { Routes, RouterModule } from '@angular/router';
import { CommunityGuardService } from '../community/community-guard.service';

// Route for content layout without sidebar, navbar and footer for pages like Login, Registration etc...

export const COMMUNITY_ROUTES: Routes = [
    {
        path: 'community/sample',
        redirectTo: 'community/test'
    },
    {
        path: 'community/:id',
        loadChildren: './pages/community-page/community-pages.module#CommunityPagesModule',
        canActivate: [CommunityGuardService]
    },
    {
        path: 'community',
        loadChildren: './pages/communities-pages/communities-pages.module#CommunitiesPagesModule'
    }
];