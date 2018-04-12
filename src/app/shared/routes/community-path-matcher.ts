import { Injectable } from '@angular/core';
import { UrlSegment, UrlMatchResult } from '@angular/router';

@Injectable()
export class CommunityPathMatcher {
    static pathMatcher(segments: UrlSegment[]): UrlMatchResult {
        if (segments.length < 2)
            return null;

        const url1 = segments[0].toString();
        const url2 = segments[1].toString();
        const community = /^(community)$/;
        const com404 = /^(404)$/;

        if (url1.match(community)) {
            if (url2.match(com404))
                return null;
            return ({ consumed: segments, posParams: { id: segments[1] } });
        }
        return null;
    }
}