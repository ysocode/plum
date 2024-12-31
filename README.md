# Plum – Use your Laravel routes in JavaScript

[![Latest Version on Packagist](https://img.shields.io/packagist/v/ysocode/plum.svg?style=flat)](https://packagist.org/packages/ysocode/plum)
[![Downloads on Packagist](https://img.shields.io/packagist/dt/ysocode/plum.svg?style=flat)](https://packagist.org/packages/ysocode/plum)

## Introduction

Plum provides a JavaScript `route()` function that works like Laravel's, making it a breeze to use
your named Laravel routes in JavaScript.

#### Inspiration

Plum is inspired by and derived from Ziggy, created by Jacob Baker-Kretzmar. For more information, check
out the [Ziggy repository](https://github.com/tighten/ziggy).

## Official Documentation

##### Install Plum using Composer:

```shell
composer require ysocode/plum
```

##### Defining routes

To define routes, you can follow the [Laravel documentation](https://laravel.com/docs/11.x/routing).
Here’s an example of how to define a resource route for "contacts":
```php
Route::resource('contacts', ContactController::class);
```

##### Using the `route()` method provided by Plum

The route function generates a URL for a given named route:
```js
route('contacts.index'); // https://plum.test/contacts
```

##### Using route parameters

For example, you may need to capture a user's ID from the URL. You may do so by defining route parameters:
```php
Route::get('/users/{user}', UserController::class)->name('users.show');
```

The route function generates a URL for a given named route with the given parameters:
```js
route('users.show', { user: 8847 }); // https://plum.test/users/8847
```

Plum generates the final result using the JavaScript URL object, so if a route parameter does not
have a [default value](#using-default-parameter-values) and is not provided through the `route()` method,
you may end up getting an unexpected result, such as 'https://plum.test/users/%7Buser%7D'.

##### Using route multiple parameters

You may want to capture multiple route parameters, in this case, we capture both the user ID and the
profile type:
```php
Route::get('/users/{user}/profiles/{profile}', UserProfileController::class)->name('users.profiles.show');
```

The route function can be used to generate the URL for this route with the necessary parameters:
```js
route('users.profiles.show', { user: 8847, profile: 'admin' }); // https://plum.test/users/8847/profiles/admin
```

##### Using query parameters

You may want to use query parameters:
```php
Route::get('/search', SearchController::class)->name('search');
```

You can pass query parameters by using the `_query` attribute:
```js
route('search', { _query: { term: 'Laravel', page: 2 } }); // https://plum.test/search?term=Laravel&page=2
```

It’s important to note that if you pass normal parameters that don’t match any defined route
parameters, those parameters will automatically become query parameters.

In this case, you can omit the _query attribute because the search.index route doesn’t require
any route parameters. Any parameters passed will automatically be treated as query parameters:
```js
route('search', { term: 'Laravel', page: 2 }); // https://plum.test/search?term=Laravel&page=2
```

Like Laravel, Plum automatically encodes boolean query parameters as integers in the query string:
```js
route('users.show', { user: 8847, active: true }); // https://plum.test/users/8847?active=1
```

##### Using default parameter values

Plum supports default route parameter values. To better understand how default parameter values work,
you can take a look at the [Laravel documentation](https://laravel.com/docs/urls#default-values).

Now that you know how to define default parameter values, you can use the `route()` function to generate
URLs without worrying about parameters that have default values.
```js
route('posts.index'); // https://plum.test/en/posts
```

##### Some other useful methods

Calling the `route()` method without arguments allows you to use other methods provided by the Router class.

###### Has method

You can check if a route exists before using it:
```js
if (route().has('posts.index')) {
    const postRoute = route('posts.index'); // https://plum.test/en/posts
}
```

##### Using route model binding

Plum supports route model binding. To better understand how route model binding work, you can take a
look at the [Laravel documentation](https://laravel.com/docs/11.x/routing#route-model-binding).

You can use explicit model binding:
```php
use App\Models\Post;
 
Route::get('/posts/{post:slug}', function (Post $post) {
    return $post;
})->name('posts.show');
```

Alternatively, you can make model binding always use a database column other than id, by defining the
route key name:
```php
/**
 * Get the route key for the model.
 */
public function getRouteKeyName(): string
{
    return 'slug';
}
```

Now that you know how to use route model binding, you can use the `route()` function to generate URLs by
passing the entire object. Plum will automatically resolve the URL using the model's slug as the route
model binding key:
```js
const post = {
    id: 8847,
    slug: 'how-to-use-plum'
};

route('posts.show', { post: post}); // https://plum.test/posts/how-to-use-plum
```

##### Importing Plum in your Vue app

Plum includes a Vue plugin to make it easy to use the `route()` helper throughout your Vue app:
```js
import { createApp } from 'vue';
import { PlumVue } from '../../vendor/ysocode/plum';
import App from './App.vue';

createApp(App).use(PlumVue);
```

Now you can use the `route()` function anywhere in your Vue components and templates:
```vue
<a class="c-link" :href="route('home')">Home</a>
```

With <script setup> in Vue 3 you can use inject to make the `route()` function available in your component script:
```vue
<script setup>
import { inject } from 'vue';
const route = inject('route');
</script>
```

## License

Plum is open-sourced software licensed under the [MIT license](LICENSE.md).
