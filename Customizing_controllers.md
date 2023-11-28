# Controllers

Controllers are functions that are executed when a route is reached. You can use them to add custom logic to your API.

Controllers can be plugin or api.

* Plugin controllers - should be added to the `./src/plugins/{plugin-name}/controllers/{CONTROLLER-NAME}.ts` file.
* API controllers - should be added to the `./src/api/{model-name}/controllers/{CONTROLLER-NAME}.ts` file.

[Controller documentation](https://docs.strapi.io/dev-docs/backend-customization/controllers)

## Creating custom controllers

You can use the command `yarn strapi generate` or `npm run strapi generate`, select `controller` and enter the name of the controller you want to create, select if is plugin or api controller and select the plugin or api if is not global, or you can create manually a file at the folders mentioned above.

Lets create a custom API controller called `exampleAction` at `./src/api/post/controllers/post.ts`(Because is api) with the following code:

```ts
/**
 * post controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::post.post",
  ({ strapi }) => {
    return {
      // Create a custom action
      async exampleAction(ctx) {
        try {
          ctx.body = "ok";
        } catch (err) {
          ctx.body = err;
        }
      },
    };
  }
);

```

## Using a controller

You can use a controller in a route by adding it to the config of the route. In this case the controller will be applied to find actions of the `posts` route.

In this case we will use the controller we created above(`exapleAction`) in the route we created above(`custom-route`, at post api routes).

```ts
export default {
  routes: [
    {
      method: "GET",
      path: "/posts/example", // you can use params here like /posts/example/:id or regex /posts/example/:id(\\d+)
      handler: "api::post.post.exampleAction", // the custom controller action
      config: {
        // some config
      },
    },
  ],
};

```

## Modifing default controller's actions

You can modify the default controller's actions by at file at `./src/api/{model-name}/controllers/{CONTROLLER-NAME}.ts` file, overriding the default action.

example:

```ts
/**
 * post controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::post.post",
  ({ strapi }) => {
    return {
     
      //Modify the find action wrapping the default find action
      async find(ctx) {
        // normal find action = /posts?{query-params}
        // custom find action = /posts?{query-params}&local=en
        try {
          ctx.query = { ...ctx.query, local: "en" };

          // calling the default find action
          const { data, meta } = await super.find(ctx);

          // some more custom logic
          meta.date = Date.now();
          return { data, meta };
        } catch (err) {
          ctx.body = err;
        }
      },

      // Overriding the findOne action
      async find(ctx) {
        // validateQuery (optional)
        // to throw an error on query params that are invalid or the user does not have access to
        await this.validateQuery(ctx);

        // sanitizeQuery to remove any query params that are invalid or the user does not have access to
        // It is strongly recommended to use sanitizeQuery even if validateQuery is used
        const sanitizedQueryParams = await this.sanitizeQuery(ctx);
        const { results, pagination } = await strapi
          .service("api::post.post")
          .find(sanitizedQueryParams);

        // sanitizeOutput to ensure the user does not receive any data they do not have access to
        const sanitizedResults = await this.sanitizeOutput(results, ctx);

        return this.transformResponse(sanitizedResults, {
          pagination,
          something: "else",
        });
      },
    };
  }
);

```

In the example above we modified the default `find` and `findOne` actions, adding a custom logic to the `find` action and overriding the `findOne` action. Because at the `find` action we are calling the default `find` action, we need to use the `super` keyword to call the default action.


## Listing controllers at terminal

Like policies and middlewares, you can list all controllers at terminal using the command `yarn strapi controllers:list` or `npm run strapi controllers:list`, this will return something like this:

```bash
┌───────────────────────────────────────────────────┐
│ Name                                              │
├───────────────────────────────────────────────────┤
│ admin::admin                                      │
├───────────────────────────────────────────────────┤
...
├───────────────────────────────────────────────────┤
│ api::tag.tag                                      │
└───────────────────────────────────────────────────┘
```

[Back](./Customizing_strapi.md)