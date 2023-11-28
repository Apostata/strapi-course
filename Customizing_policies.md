
# Policies

Policies are functions that are executed before or after a specific route action. You can use them to add custom logic to your API.

## SCOPES

Scopes are a way to restrict access to content-types and their records. There are three types of scopes:

* **Global policies** - belong to the Strapi core and can be associated to any route throughout the application. 
 at `./src/policies`. id like `global::is-authenticated`
* **Plugin policies** - are introduced by plugins, but can be generally use globally like the global scopes. 
  at `./src/plugins/{plugin-name}/policies`. id like `plugin::users-permissions.is-authenticated`
* **API policies** - are specific to an Content type and are applied to all routes of this content type.
   at `./src/api/{model-name}/policies`. id like `is-amdin` or `api::{model-name}.is-admin` to using for another api

[Policy documentation](https://docs.strapi.io/dev-docs/backend-customization/routes#policies)

**List policies at terminal** : `yarn strapi policies:list`	or `npm run strapi policies:list`

will return something like this:

```bash
┌───────────────────────────────────────────────┐
│ Name                                          │
├───────────────────────────────────────────────┤
│ admin::isAuthenticatedAdmin                   │
├───────────────────────────────────────────────┤
...
├───────────────────────────────────────────────┤
│ plugin::content-manager.hasPermissions        │
└───────────────────────────────────────────────┘
```

### Creating a policy

you can use the command `yarn strapi generate` or `npm run strapi generate`, select `policy` and enter the name of the policy you want to create, select if is global, plugin or api policy and select the plugin or api if is not global.

example: `yarn strapi generate` select, policy enter the name `is-admin` and select  api for Posts. This will create a policy at `./src/api/posts/policies/is-admin.ts`.

or you can create manually a file at `./src/api/{model-name}/policies/{policy-name}.ts` file. with the following structure:

```ts
export default (policyContext, config, { strapi }) => {
  const role = policyContext.state.user.role.name; //Authenticated
  if (role === config.userRole) {
    return true;
  }

  return false;
};
```

### Using a policy

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

[Back](./Customizing_strapi.md)