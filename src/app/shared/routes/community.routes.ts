import { Routes } from '@angular/router';
import { CommunityGuardService } from '../community/community-guard.service';
import { CommunityPathMatcher } from './community-path-matcher';

export const COMMUNITY_ROUTES: Routes = [
    {
        loadChildren: '../../pages/community-page/community-pages.module#CommunityPagesModule',
        // loadChildren: './pages/community-page/community-pages.module#CommunityPagesModule',
        canActivate: [CommunityGuardService],
        matcher: CommunityPathMatcher.pathMatcher
    }
];