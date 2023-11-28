# Services

Services are functions that are executed when a controller action is reached. services perform actual data operations.
services are helper functions that usually perform single, specific tasks, and are meant to be reusable.

Services can be plugin or api.

* Plugin services - should be added to the `./src/plugins/{plugin-name}/services/{SERVICE-NAME}.ts` file.
* API services - should be added to the `./src/api/{model-name}/services/{SERVICE-NAME}.ts` file.

[Service documentation](https://docs.strapi.io/dev-docs/backend-customization/services)

## Creating custom services

You can't use the command `strapi generate` for services, but you can create manually a file at the folders mentioned above.

Lets create a custom API service called `exampleService` at `./src/api/post/services/post.ts`(Because is api) with the following code:

```ts
export default factories.createCoreService("api::post.post", ({ strapi }) => {
  return {
    // Method 1: Creating an entirely custom service
    async exampleService(...args) {
      let response = { okay: true };

      if (response.okay === false) {
        return { response, error: true };
      }

      return response;
    },

    // Method 2: Wrapping a core service (leaves core logic in place)
    async find(...args) {
      // Calling the default core controller
      const { results, pagination } = await super.find(...args);

      // some custom logic
      results.forEach((result) => {
        result.counter = 1;
      });

      return { results, pagination };
    },
  };
});
  
```

## Using a service

You can use a service in a controller action by adding it to the config of the controller action. In this case the service will be applied to find actions of the `posts` route.

In this case we will use the service we created above(`exapleService`) in the controller we created above(`custom-controller`, at post api controllers).

```ts
export default factories.createCoreController(
  "api::post.post",
  ({ strapi }) => {
    return {
      // Create a custom action
      async exampleAction(ctx) {
        await strapi
          .service("api::post.post")
          .exampleService({ someParam: "someValue" }); // calling the service
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

in the example above we are calling the service we created above(`exampleService`) at the `exampleAction` controller action. Because we are calling the service at the controller action, we need to inject the strapi object to the controller action, so we can call the service.
The others services are injected by default, because they are wrapper or override the default services.

## Modifing default service's actions (Entity service and Query Engine APIs) 

* **Entity service API** handle data operations, like create, findOne, findMany, create, update, delete with the ability to filter, order and paginate the results, populate relations, components and dynamic zones, the creation and update of components and dynamic zones. 

* **Query Engine API** The lowest level that interacts with databases. It id not aware of complex data structures like components and dynamic zones.

[Entity Service API docs](https://docs.strapi.io/dev-docs/api/entity-service)

[Query Engine API docs](https://docs.strapi.io/dev-docs/api/query-engine)


| Functions          | Resposability                                                                         | Accessible via ...(example)                                                             |
| ------------------ | ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------- |
| Services           | Reusable single tasks                                                                 | `strapi.services("api::post.post").exampleService(args)`                                |
| Entity Service API | Data operations, managing also complex data structures (components and dynamic Zones) | `strapi.entityService.findOne("api::post.post", entityId, this.getFetchParams(params))` |
| Query Engine API   | The lowest level that interacts with databases. unaware of complex data structures    | `strapi.db.query("api::post.post").findMany()`                                          |


## Listing services at terminal

Like policies, middlewares and controllers, you can list all services at terminal using the command `yarn strapi services:list` or `npm run strapi services:list`, this will return something like this:

```bash
┌───────────────────────────────────────────────────┐
│ Name                                              │
├───────────────────────────────────────────────────┤
│ admin::user                                       │
├───────────────────────────────────────────────────┤
...
├───────────────────────────────────────────────────┤
│ api::tag.tag                                      │
└───────────────────────────────────────────────────┘
```

[Back](./Customizing_strapi.md)