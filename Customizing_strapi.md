# Customizing Strapi

## Models

By default when you create a Model, Strapi will create an api with the same name and a single endpoint `/api/{model-name}`.
you can manually create a nested another model in the same api.

[Model documentation](https://docs.strapi.io/dev-docs/backend-customization/models)


## Policy, controller and service Strapi object

This Strapi object gets injected is strapi core functions (policies, controllers and services) to give them access to the other strapi functionalities, in order to enable code modularity and reusability.

## Routes customization
[Customizing routes](Customizing-routes.md)

## Policies customization
[Customizing policies](Customizing_policies.md)

## Middlewares customization
[Customizing middlewares](Customizing_middlewares.md)

## Controllers customization
[Customizing controllers](Customizing_controllers.md)

## Services customization
[Customizing services](Customizing_services.md)

## Lifecycle Hooks

Are functions that are executed before or after a specific model action. You can use them to add custom logic to your API. 
You can create a hook inside the `./src/api/{model-name}/content-type/{model-name}/lifecycles.ts` file.
Means to do something internal when some event happens.

[LifiCycle Hooks documentation](https://docs.strapi.io/dev-docs/backend-customization/models#lifecycle-hooks)

[Back](readme.md)