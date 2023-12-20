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
  index: async (ctx) =>{
    ctx.body = await strapi
      .plugin("github-projects")
      .service("getReposService")
      .getPublicRepos();
  },
});

```

Exemple of `get-repos-service.ts` file:

```ts
import { Strapi } from "@strapi/strapi";
import { request } from "@octokit/request";

const { GITHUB_TOKEN } = process.env;

export default ({ strapi }: { strapi: Strapi }) => ({
  getPublicRepos: async () => {
    const result = await request("GET /user/repos", {
      headers: {
        authorization: `token ${GITHUB_TOKEN}`,
      },
      type: "public",
    });

    const repos = Promise.all(
      result?.data?.map(async (repo) => {
        const { id, name, description, html_url, owner, default_branch } = repo;
        console.log(
          "repo",
          id,
          name,
          description,
          html_url,
          owner,
          default_branch
        );
        const readmeUrl = `https://raw.githubusercontent.com/${owner.login}/${name}/${default_branch}/README.md`;
        let longDescription;
        try {
          longDescription = (await axios.get(readmeUrl))?.data;
        } catch (e) {
          longDescription = description || "# without readme";
        }
        return {
          id,
          name,
          shortDescription: description,
          longDescription,
          url: html_url,
        };
      })
    );
    return repos;
  },
});

```	

### Creating the Content Type

Now we need to create a content type to store the data from the github api. At the plugin folder, at `./server/content-types/`, create a file named `project-schema.ts` with the following content:

```ts
export default {
  kind: "collectionType",
  collectionName: "projects",
  info: {
    singularName: "project",
    pluralName: "projects",
    displayName: "Project",
  },
  options: {
    draftAndPublish: false,
  },
  attributes: {
    repositoryId: {
      type: "uid",
    },
    title: {
      type: "string",
      required: true,
      unique: true,
    },
    shortDescription: {
      type: "string",
    },
    repositoryUrl: {
      type: "string",
    },
    longDescription: {
      type: "richtext",
    },
    coverImage: {
      type: "media",
      allowedTypes: ["images"],
      multiple: false,
    },
  },
};

```

then at `./index.ts`, in the same folder, export the schema:

```ts
import projectSchema from "./project-schema";
export default {
  project: { schema: projectSchema },
};

```

### Properly showing markdown content at richText

Firts, lets install `npm install markdown-it` at the plugin project, To convert the markdown to html.

Then, at the `./server/services/get-repos-service.ts` file, lets import the markdown-it library and use it to convert the markdown to html. this is complete code:

```ts
import markdownIt from "markdown-it";

const md = markdownIt();
const { GITHUB_TOKEN } = process.env;

type Repo = {
  id: string;
  name: string;
  shortDescription: string;
  longDescription: string;
  url: string;
};

export default ({ strapi }: { strapi: Strapi }) => ({
  getRepoProject: async (repo: Repo) => {
    const { id } = repo;
    const projects = await strapi.entityService?.findMany(
      "plugin::github-projects.project",
      {
        filters: {
          repositoryId: id,
        },
      }
    );
    const projectId =
      (projects as Repo[])?.length > 0 ? projects?.[0]?.id : null;

    return projectId;
  },

  getPublicRepos: async () => {
    const result = await request("GET /user/repos", {
      headers: {
        authorization: `token ${GITHUB_TOKEN}`,
      },
      type: "public",
    });

    const repos = Promise.all(
      result?.data?.map(async (repo) => {
        const { id, name, description, html_url, owner, default_branch } = repo;

        const readmeUrl = `https://raw.githubusercontent.com/${owner.login}/${name}/${default_branch}/README.md`;
        let longDescription;
        try {
          longDescription = md
            .render((await axios.get(readmeUrl))?.data)
            ?.replace(/\n/g, "<br />");
        } catch (e) {
          longDescription = description || "# without readme";
        }
        const repository = {
          id,
          name,
          shortDescription: description,
          longDescription,
          url: html_url,
        };

        const projectId = await strapi
          .plugin("github-projects")
          .service("getReposService")
          .getRepoProject(repository);
        return {
          ...repository,
          projectId,
        };
      })
    );

    return repos;
  },
});

```

### Creating the Plugin's UI at the Admin Panel
[Create the UI for plugin](./Plugin_ui_at_admin_panel.md)


[Plugin content types documentation](https://docs.strapi.io/dev-docs/api/plugins/server-api#content-types)
[Model documentation](https://docs.strapi.io/dev-docs/backend-customization/models)