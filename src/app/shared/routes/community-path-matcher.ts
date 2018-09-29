import { Injectable } from '@angular/core';
import { UrlSegment, UrlMatchResult } from '@angular/router';

@Injectable()
export class CommunityPathMatcher {
    static pathMatcher(segments: UrlSegment[]): UrlMatchResult {
        if (segments.length < 2)
            return null;

        const url1 = segments[1].toString();
        const com404 = /^(404)$/;

        if (url1.match(com404))
            return null;
        return ({ consumed: segments, posParams: { id: segments[1] } });
    }
    static searchMatcher(segments: UrlSegment[]): UrlMatchResult {
        const url1 = segments[0].toString();
        const search = /^(search)$/;
        const paths = segments.map(v => v.path);
        if (url1.match(search))
            return { consumed: [segments[0]], posParams: { search: new UrlSegment(paths.join(' '), {}) } };
        return {
            consumed: [new UrlSegment(`search`, {}), new UrlSegment(`404`, {})],
            posParams: { search: new UrlSegment(paths.join(''), {}) }
        };
    }
}