<?php

return [

    /*
    |--------------------------------------------------------------------------
    | CORS Paths
    |--------------------------------------------------------------------------
    |
    | Here you may configure your CORS paths.
    |
    */

    'paths' => ['api/*', 'login', 'logout', 'sanctum/csrf-cookie'],

    /*
    |--------------------------------------------------------------------------
    | CORS Allowed Methods
    |--------------------------------------------------------------------------
    |
    | Here you may configure your CORS allowed methods.
    |
    */

    'allowed_methods' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | CORS Allowed Origins
    |--------------------------------------------------------------------------
    |
    | Here you may configure your CORS allowed origins.
    |
    */

    'allowed_origins' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | CORS Allowed Origins Patterns
    |--------------------------------------------------------------------------
    |
    | Here you may configure your CORS allowed origins patterns.
    |
    */

    'allowed_origins_patterns' => [],

    /*
    |--------------------------------------------------------------------------
    | CORS Allowed Headers
    |--------------------------------------------------------------------------
    |
    | Here you may configure your CORS allowed headers.
    |
    */

    'allowed_headers' => ['*'],

    /*
    |--------------------------------------------------------------------------
    | CORS Exposed Headers
    |--------------------------------------------------------------------------
    |
    | Here you may configure your CORS exposed headers.
    |
    */

    'exposed_headers' => [],

    /*
    |--------------------------------------------------------------------------
    | CORS Max Age
    |--------------------------------------------------------------------------
    |
    | Here you may configure your CORS max age.
    |
    */

    'max_age' => 0,

    /*
    |--------------------------------------------------------------------------
    | CORS Supports Credentials
    |--------------------------------------------------------------------------
    |
    | Here you may configure your CORS supports credentials.
    |
    */

    'supports_credentials' => true,

];