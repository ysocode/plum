export const defaultPlum = {
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
