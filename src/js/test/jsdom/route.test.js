// @vitest-environment jsdom

import {beforeAll, beforeEach, describe, expect, it} from 'vitest';
import {route} from '../../../../src/js';

const defaultWindow = {
    location: {
        host: 'plum.dev',
    },
};

const defaultPlum = {
    url: 'https://plum.dev',
    port: null,
    defaults: {locale: 'en'},
    routes: {
        home: {
            uri: '/',
            methods: ['GET', 'HEAD'],
        },
        'posts.index': {
            uri: '/posts',
            methods: ['GET', 'HEAD'],
        },
        'posts.show': {
            uri: '/posts/{post}',
            methods: ['GET', 'HEAD'],
            bindings: {
                post: 'id',
            },
        },
        'posts.update': {
            uri: '/posts/{post}',
            methods: ['PUT'],
            bindings: {
                post: 'id',
            },
        },
        'postComments.show': {
            uri: '/posts/{post}/comments/{comment}',
            methods: ['GET', 'HEAD'],
            bindings: {
                post: 'id',
                comment: 'uuid',
            }
        },
        'translatePosts.index': {
            uri: '/{locale}/posts',
            methods: ['GET', 'HEAD'],
        },
    }
};

beforeAll(() => {
    delete window.location;
    window.location = {};
});

beforeEach(() => {
    window.location = {...defaultWindow.location};
    global.window.location = window.location;
    global.plum = {...defaultPlum};
});

describe('route()', function () {
    it('should be able to generate a URL with no parameters', function () {
        const routeResult = route('posts.index');

        expect(routeResult).toBe('https://plum.dev/posts');
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


