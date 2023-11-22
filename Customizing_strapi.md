# Customizing Strapi

## Models

By default when you create a Model, Strapi will create an api with the same name and a single endpoint `/api/{model-name}`.
you can manually create a nested another model in the same api.

[Model documentation](https://docs.strapi.io/dev-docs/backend-customization/models)

## Lifecycle Hooks

Are functions that are executed before or after a specific model action. You can use them to add custom logic to your API. 
You can create a hook inside the `./src/api/{model-name}/content-type/{model-name}/lifecycles.ts` file.
Means to do something internal when some event happens.

[LifiCycle Hooks documentation](https://docs.strapi.io/dev-docs/backend-customization/models#lifecycle-hooks)

## Routes

By default when you create a Model, Strapi will create an api with the same name and a single endpoint `/api/{model-name}`.
Each route as Policies, middlewares and controllers.

[Routes documentation](https://docs.strapi.io/dev-docs/backend-customization/routes)

### Customizing or Creating Existing Route

#### Route file:

```ts
module.exports = createCoreRouter("api::tag;tag",{
	//custom options
	prefix: "", //default is "/{model-name}" but you can change it to "something" then the route will be "/something/tags"
	only:["find", "findOne"], //default is all actions, but you can specify which actions you want to use in this sample get and get one
	except:["create", "update", "delete"], //default is none, but you can specify which actions you want to exclude in this sample create, update and delete
	// you will use only or except
	config:{
		find:{
			auth:false, //default is true, but you can disable authentication for this action, false means that you can access this action without being logged in
			policies:[], //default is none, but you can specify which policies you want to use
			middlewares:[], //default is none, but you can specify which middlewares you want to use
		},
		findOne:{
			...
		},
		create:{
			...
		},
		update:{
			...
		},
		delete:{
			...
		},
	}
})
```

#### Customizing

You can customize an existing route by creating a file in the `./src/api/{model-name}/routes/{model-name}.ts` file.

#### Creating

Creating custom routers consists in creating a file that exports an array of objects, each object being a route with the following parameters:

| Parameter | Description                                                                                                | Type   |
| --------- | ---------------------------------------------------------------------------------------------------------- | ------ |
| method    | The HTTP method (GET, POST, PUT, DELETE and PATCH)                                                         | string |
| path      | Path to reach, starting with a forward-leading slash (e.g. /articles)                                      | string |
| handler   | Function to execute when the route is reached.  Should follow this syntax: `<controllerName>.<actionName>` | string |
| config    | configuration to handle, policies, middlewares and public availability                                     | object |

example:

```ts
export default {
  routes: [
    {
      method: "GET",
      path: "/posts/example", // you can use params here like /posts/example/:id or regex /posts/example/:id(\\d+)
      handler: "myCustomController.example",
      config: {
        // some config
      },
    },
  ],
};

```

[Route documentation](https://docs.strapi.io/dev-docs/backend-customization/routes)


### Policies

Policies are functions that are executed before or after a specific route action. You can use them to add custom logic to your API.

#### SCOPES

Scopes are a way to restrict access to content-types and their records. There are three types of scopes:

* **Global policies** - belong to the Strapi core and can be associated to any route throughout the application. at `./src/policies`. id like `global::is-authenticated`
* **Plugin policies** - are introduced by plugins, but can be generally use globally like the global scopes. at `./src/plugins/{plugin-name}/policies`. id like `plugin::users-permissions.is-authenticated`
* **API policies** - are specific to an Content type and are applied to all routes of this content type. at `./src/api/{model-name}/policies`. id like `is-amdin` or `api::{model-name}.is-admin` to using for another api

[Policy documentation](https://docs.strapi.io/dev-docs/backend-customization/routes#policies)

**List policies at terminal** : `yarn strapi policies:list`	or `npm run strapi policies:list`

will return something like this:

```bash
┌───────────────────────────────────────────────┐
│ Name                                          │
├───────────────────────────────────────────────┤
│ admin::isAuthenticatedAdmin                   │
├───────────────────────────────────────────────┤
│ admin::hasPermissions                         │
├───────────────────────────────────────────────┤
│ admin::isTelemetryEnabled                     │
├───────────────────────────────────────────────┤
│ plugin::content-manager.has-draft-and-publish │
├───────────────────────────────────────────────┤
│ plugin::content-manager.hasPermissions        │
└───────────────────────────────────────────────┘
```

##### Creating a policy
you can use the command `yarn strapi generate` or `npm run strapi generate`, select `policy` and enter the name of the policy you want to create, select if is global, plugin or api policy and select the plugin or api if is not global.

example: `yarn strapi generate` select, policy enter the name `is-admin` and select  api for Posts. This will create a policy at `./src/api/posts/policies/is-admin.ts`.

or you can create manually a file at `./src/api/{model-name}/policies/{policy-name}.ts` file. with the following structure:

```ts
export default (policyContext, config, { strapi }) => {
  const role = policyContext.state.user?.role?.name; //Administrator, Editor, Author, etc.
  if (role === "Administrator") {
    return true;
  }

  return false;
};
```

##### Using a policy

You can use a policy in a route by adding it to the config of the route. In this case the policy will be applied to find actions of the `posts` route.

```ts
import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::post.post", {
  config: {
    find: {
      policies: ["is-admin"], // or ['plugins::{plugin}.is-admin'], ['global::is-admin'] or ['api::{api-name}.is-admin']
    },
  },
});
```

passing parameters to a policy:

```ts
import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::post.post", {
  config: {
    find: {
      policies: [
		{
			name:"is-admin",
			config:{
				userRole:'Author'
			}
		}
	  ], // or ['plugins::{plugin}.is-admin'], ['global::is-admin'] or ['api::{api-name}.is-admin']
    },
  },
});
```


