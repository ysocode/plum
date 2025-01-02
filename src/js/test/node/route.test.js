import {describe, expect, it} from 'vitest';
import Router from "../../Router.js";

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

describe('Route', function () {
    const router = new Router(defaultPlum.url, parseInt(defaultPlum.port), defaultPlum.defaults, defaultPlum.routes);

    it('should be able to generate a URL with no parameters', function () {
        const compiledRouteAsString = router.fetchRoute('posts.index')
            .compile()
            .toString();

        expect(compiledRouteAsString).toBe('https://plum.dev/posts');
    });

    it('should be able to generate a URL with default parameters', function () {
        const compiledRouteAsString = router.fetchRoute('translatePosts.index')
            .compile()
            .toString();

        expect(compiledRouteAsString).toBe('https://plum.dev/en/posts');
    });

    it('should be able to generate a relative URL by passing absolute = false', function () {
        const compiledRouteAsString = router.fetchRoute('posts.index', {}, false)
            .compile()
            .toString();

        expect(compiledRouteAsString).toBe('/posts');
    });

    it('should be able to generate a URL with fragment', function () {
        const compiledRouteAsString = router.fetchRoute('posts.index', {_fragment: 'test'})
            .compile()
            .toString();

        expect(compiledRouteAsString).toBe('https://plum.dev/posts#test');
    });
});


