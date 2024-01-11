# Configure Media Provider

Using an external media provider is a good practice to avoid storing files in the same server as the application, and improve the performance of the application, since the files will be served from a CDN.

In this tutorial we will use `Cloudinary` as the media provider.

Install the plugin: `npm i @strapi/provider-upload-cloudinary`

[Upload Plugin](https://docs.strapi.io/dev-docs/plugins/upload)

configure the plugin: `./config/env/production/plugins.js`:

```ts
export default ({ env }) => ({
 ...
  upload: {
    config: {
      provider: 'cloudinary',
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
});

```

## Add Security middleware configuration
at `./config/env/production/middleware.js`, replace `strapi::security` with the folowing:

```ts
export default [
  "strapi::errors",
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'market-assets.strapi.io', 'res.cloudinary.com'],
          'media-src': [
            "'self'",
            'data:',
            'blob:',
            'market-assets.strapi.io',
            'res.cloudinary.com',
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  "strapi::cors",
  "strapi::poweredBy",
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];

```	
Put the following variables in the `.env` file and be sure to put then in your cloud provider `environment variables`:

```env
CLOUDINARY_NAME={YOUR_CLOUDINARY_NAME}
CLOUDINARY_KEY={YOUR_CLOUDINARY_KEY}
CLOUDINARY_SECRET={YOUR_CLOUDINARY_SECRET}
```
