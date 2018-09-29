import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { CommunityService } from './community.service';

@Injectable()
export class CommunityGuardService implements CanActivate {
    constructor(private comService: CommunityService, private router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot) {
        return this.comService.getUrl(route.params['id']).then(val => val, error => {
            console.log(error);
            return false;
        }).then(exists => {
            if (!exists)
                this.router.navigate(['/search/404'], {
                    queryParams: {
                        search: route.params['id']
                    }
                });
            return exists;
        });
    }
}