// @vitest-environment jsdom

import {beforeAll, beforeEach, describe, expect, it} from 'vitest';
import {route} from '../../../../src/js';
import {defaultPlum} from "../utils/sharedData.js";

const defaultWindow = {
    location: {
        host: 'plum.dev',
    },
};

beforeAll(() => {
    delete window.location;
    window.location = {};
});

beforeEach(() => {
    window.location = {...defaultWindow.location};
    global.window.location = window.location;
    global.ysoCodePlum = {...defaultPlum};
});

describe('route()', function () {
    it('should be able to generate a URL with no parameters', function () {
        const routeResult = route('posts.index');

        expect(routeResult).toBe('https://plum.dev/posts');
    });

    it('should be able to generate a URL with parameters', function () {
        const routeResult = route('posts.show', {post: 8847});

        expect(routeResult).toBe('https://plum.dev/posts/8847');
    });

    it('should be able to generate a URL with multiple parameters', function () {
        const routeResult = route(
            'posts.comments.show',
            {
                post: 8847,
                comment: '49daadf7-1039-4033-ac7a-c111eae7b9d5'
            }
        );

        expect(routeResult).toBe('https://plum.dev/posts/8847/comments/49daadf7-1039-4033-ac7a-c111eae7b9d5');
    });

    it('should be able to generate a URL with parameters using an entire object when route have a binding', function () {
        const post = {
            id: 8847
        };

        const routeResult = route('posts.update', {post});

        expect(routeResult).toBe('https://plum.dev/posts/8847');
    });

    it('should be able to generate a URL with multiple parameters using an entire object when route have a binding', function () {
        const post = {
            id: 8847
        };

        const comment = {
            uuid: '49daadf7-1039-4033-ac7a-c111eae7b9d5'
        };

        const routeResult = route(
            'posts.comments.show',
            {
                post,
                comment
            }
        );

        expect(routeResult).toBe('https://plum.dev/posts/8847/comments/49daadf7-1039-4033-ac7a-c111eae7b9d5');
    });

    it('should be able to generate a URL with query parameters using _query attribute', function () {
        const routeResult = route(
            'posts.index',
            {
                _query: {
                    post: 8847
                }
            }
        );

        expect(routeResult).toBe('https://plum.dev/posts?post=8847');
    });

    it('should convert missing parameters to query parameters', function () {
        const routeResult = route('posts.index', {post: 8847});

        expect(routeResult).toBe('https://plum.dev/posts?post=8847');
    });

    it('should convert boolean values to integer values', function () {
        const routeResult = route('posts.show', {post: 8847, active: true});

        expect(routeResult).toBe('https://plum.dev/posts/8847?active=1');
    });

    it('should be able to generate a URL with default parameters', function () {
        const routeResult = route('translatePosts.index');

        expect(routeResult).toBe('https://plum.dev/en/posts');
    });

    it('should be able to generate a relative URL by passing absolute = false', function () {
        const routeResult = route('posts.index', {}, false);

        expect(routeResult).toBe('/posts');
    });

    it('should be able to generate a URL with fragment', function () {
        const routeResult = route('posts.index', {_fragment: 'test'});

        expect(routeResult).toBe('https://plum.dev/posts#test');
    });
});
