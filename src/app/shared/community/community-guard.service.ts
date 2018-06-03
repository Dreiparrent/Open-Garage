import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';
import { CommunityService } from './community.service';

@Injectable()
export class CommunityGuardService implements CanActivate {
    constructor(private comService: CommunityService, private router: Router) {

    }

    canActivate(route: ActivatedRouteSnapshot) {
        return this.comService.getCommunity(route.params['id']).then(val => true, error => {
            console.log(error);
            return false;
        }).then(exists => {
            if (!exists)
                this.router.navigate(['/community/404'], {
                    queryParams: {
                        search: route.params['id']
                    }
                });
            return exists;
        });
    }
}