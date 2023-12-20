# Plugin Creation

Let's using the generate command at the terminal to create a plugin. run `npm run strapi generate` or `strapi generate`, then enter the name o your plugin. In this case, we will use `github-projects`.
Strapi will generate a folder with the name of your plugin inside the `plugins` folder. Which will contain files as it is a mini Strapi app (it is in fact a new project with it own structure).

after the plugin is created, we need to register it in the `./config/plugins.js` file. As described in terminal after the plugin is created.

```bash
You can now enable your plugin by adding the following in ./config/plugins.ts
────────────────────────────────────────────
export default {
  // ...
  '{NAME_OF_YOUR_PLUGIN}': {
    enabled: true,
    resolve: './src/plugins/{NAME_OF_YOUR_PLUGIN}'
  },
  // ...
}
```

## installing and build
At plugin folder run `npm install` and `npm run build` to install dependencies and build the plugin.

**Note: Every modification in the plugin files will require a new build.**


## Developing the github-projects plugin

1. Install at the plugin folder the `@octokit/request` to use the octokit library.
2. generate a personal access token at github and add it to the `.env` file in the root of the main Strapi Project, not on the plugin folder.


### Creating the route

At `{NAME_OF_YOUR_PLUGIN_FOLDER}/server/routes` in our case `github-projects/server/routes`, lets configure the routes to use the plugin:

```ts
export default [
  {
    method: "GET",
    path: "/repos", //accessible at http://localhost:1337/github-projects/repos
    handler: "getReposController.index",
    config: {
      policies: [],
    },
  },
];

```	

### Creating the Controller

At `{NAME_OF_YOUR_PLUGIN_FOLDER}/controllers` in our case `github-projects/controllers` folder, name `my-controller.ts` to something meaningful. and at `index.ts` export the controller.

Example of `index.ts` file:

```ts
import getReposController from "./get-repos-controller"; // renamed from my-controller.ts

export default {
  getReposController,
};

```	

Exemple of `get-repos-controller.ts` file:

```ts
import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin("github-projects")
      .service("getReposService")
      .getPublicRepos();
  },
});

```	

### Creating the Service

At `{NAME_OF_YOUR_PLUGIN_FOLDER}/services` in our case `github-projects/services` folder, name `my-service.ts` to something meaningful. and at `index.ts` export the service.

Example of `index.ts` file:

```ts
import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin("github-projects")
      .service("getReposService")
      .getPublicRepos();
  },
});

```

Exemple of `get-repos-service.ts` file:

```ts
import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  getPublicRepos() {
    return // call the octokit library to get the repos
  },
});

```	