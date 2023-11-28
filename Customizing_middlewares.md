# Middlewares

Middlewares are functions that are executed after a request in certain route and that somehow alter the request-response flow, some middlewares can be executed before or after the controller.

All middlewares are located at the **Midleware configuration file**: `./config/middlewares.ts` and can be used in any route.

* Strapi middlewares - is the middlewares that are used by strapi core, you can use them in your routes.
* Custom middlewares - is the middlewares that you create, you can use them in your routes.

**NOTE: once created, custom middlewares should be added to the middeware configuration file, or Strapi won't load then**

Like policies, middlewares can be global, plugin or api.
* Global middlewares - should be added to the `./src/middlewares/{MIDDLEWARE-NAME}.ts` file.
* Plugin middlewares - should be added to the `./src/plugins/{plugin-name}/middlewares/{MIDDLEWARE-NAME}.ts` file.
* API middlewares - should be added to the `./src/api/{model-name}/middlewares/{MIDDLEWARE-NAME}.ts` file.

[Middleware documentation](https://docs.strapi.io/dev-docs/backend-customization/middlewares)


## Creating a middleware

Again, like policies, you can use the command `yarn strapi generate` or `npm run strapi generate`, select `middleware` and enter the name of the middleware you want to create, select if is global, plugin or api middleware and select the plugin or api if is not global, or you can create manually a file at the folders mentioned above.

Lets create a Global middleware called `time-header` at `./src/middlewares/time-header.ts`(Because is global) with the following code:

```ts
export default () => {
  return async (ctx, next) => {
    const start = Date.now();
    await next();
    const delta = Math.ceil(Date.now() - start);
    ctx.set("X-Response-Time", delta + "ms");
  };
};

```

this middleware will add a header to the response with the time that took to process the request in milliseconds on the header `X-Response-Time` at all requests.

## Using a middleware
Now that we have created a middleware, we need to add it to the middleware configuration file (`./config/middlewares.ts`), so strapi can load it.

here is an example of the middleware configuration file:

```ts
export default [
  "global::timer-header", // this is the middleware we created
  "strapi::errors",
  "strapi::security",
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

**NOTE: if you aren't sure if you should put the middleware at the begining or at the end of the array, put at the end.In this case we put it at the begining to make sure it can run and return a more precise time**


## Listing middlewares at terminal
Like policies, you can list all middlewares at terminal using the command `yarn strapi middlewares:list` or `npm run strapi middlewares:list`, this will return something like this:

```bash
┌─────────────────────────────────────┐
│ Name                                │
├─────────────────────────────────────┤
│ admin::rateLimit                    │
├─────────────────────────────────────┤
...
├─────────────────────────────────────┤
│ plugin::users-permissions.rateLimit │
└─────────────────────────────────────┘
```

[Back](./Customizing_strapi.md)