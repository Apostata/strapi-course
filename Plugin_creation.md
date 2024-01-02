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

## Installing and build

At plugin folder run `npm install` and `npm run build` to install dependencies and build the plugin.
then at the root of the main Strapi project, run `npm run develop` to start the server or `npm run develop -- --watch-admin`, for watching for changes at admin folder.

**Note: Every modification in the plugin files at Server folder ou new Files in Admin folder will require a new build**


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


### Plugin Role based access control (RBAC)

You can create a role for the plugin, and assign it to a user. This role will have access to the plugin's content types and permissions.

At the plugin folder, in this case `github-projects`, `src/plugins/github-projects/server/bootstrap.ts`,
create constant for the RBAC actions, and register them at the bootstrap phase:

```ts

import { Strapi } from "@strapi/strapi";

// Role Based Access Control actions
const RBAC_ACTIONS = [
  {
    section: "plugins",
    displayName: "Access the GitHub Projects plugin",
    uid: "access",
    pluginName: "github-projects",
  },
   {
    section: "plugins",
    subCategory: "Repositories", // to better organize the permissions
    displayName: "Read github Repositories",
    uid: "repos.read",
    pluginName: "github-projects",
  },
];

export default async ({ strapi }: { strapi: Strapi }) => {
  // bootstrap phase
  await strapi.admin?.services.permission.actionProvider.registerMany(
    RBAC_ACTIONS
  );
};

```

then at `src/plugins/github-projects/admin/src/index.tsx` add the permissions in the plugin registration permissions:

```tsx
...

const name = pluginPkg.strapi.name;

export default {
  register(app: any) {
    app.addMenuLink({
      to: `/plugins/${pluginId}`,
      icon: PluginIcon,
      intlLabel: {
        id: `${pluginId}.plugin.name`,
        defaultMessage: name,
      },
      Component: async () => {
        const component = await import("./pages/App");

        return component;
      },
      permissions: [
        // set the permissions of the plugin here
        {
          action: "plugin::github-projects.access", // the action name should be plugin::plugin-name.actionType
          subject: null,
        },
      ],
    });
    const plugin = {
      id: pluginId,
      initializer: Initializer,
      isReady: false,
      name,
    };

    app.registerPlugin(plugin);
  },

  bootstrap(app: any) {},

  ...
  },
};
 
```

#### RBAC for content routes

Now we will create a policy to check if the user has the permission to access the plugin's content routes.
in this case, we will create a policy to check if the user has the permission to read, write, delete projects the plugin's repositories, by updating the policies object at plugin route.

```ts	
export default [
  {
    method: "GET",
    path: "/repos", //accessible at http://localhost:1337/github-projects/repos
    handler: "getReposController.index",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        {
          name: "admin::hasPermissions",
          config: {
            actions: [
              "plugin::github-projects.repos.read",
              "plugin::github-projects.projects.read",
            ],
          },
        },
      ], //somente admin pode acessar
    },
  },
  {
    method: "POST",
    path: "/project",
    handler: "projectController.create",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        {
          name: "admin::hasPermissions",
          config: {
            actions: ["plugin::github-projects.projects.create"],
          },
        },
      ],
    },
  },
  {
    method: "POST",
    path: "/projects",
    handler: "projectController.createMany",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        {
          name: "admin::hasPermissions",
          config: {
            actions: ["plugin::github-projects.projects.create"],
          },
        },
      ], //somente admin pode acessar
    },
  },
  {
    method: "DELETE",
    path: "/project/:id",
    handler: "projectController.delete",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        {
          name: "admin::hasPermissions",
          config: {
            actions: ["plugin::github-projects.projects.delete"],
          },
        },
      ], //somente admin pode acessar
    },
  },
  {
    method: "DELETE",
    path: "/projects",
    handler: "projectController.deleteMany",
    config: {
      policies: [
        "admin::isAuthenticatedAdmin",
        {
          name: "admin::hasPermissions",
          config: {
            actions: ["plugin::github-projects.projects.delete"],
          },
        },
      ], //somente admin pode acessar
    },
  },
];

```

Now in admin panel, you must set the permissions to the role, to access the plugin's content routes.

#### RBAC for public routes

Now we will create public routes to acesse the project Entity.

```ts
export default [
  ...
  {
    method: "GET",
    path: "/projects", //accessible at http://localhost:1337/github-projects/projects
    handler: "projectController.find",
    config: {
      auth: false,
      //prefix: false
    },
  },
  {
    method: "GET",
    path: "/project/:id", //accessible at http://localhost:1337/github-projects/project/1
    handler: "projectController.findOne",
    config: {
      auth: false,
      //prefix: false // chnahge the prefix to false to remove the /github-projects from the url = http://localhost:1337/project/1
    },
  },
];
```

updating controllers:

```ts
export default ({ strapi }: { strapi: Strapi }) => ({
  ...
  find: async (ctx: any) => {
    const { query } = ctx;
    const projects = await strapi
      .plugin("github-projects")
      .service("projectService")
      .find(query);
    return projects;
  },

  findOne: async (ctx: any) => {
    const { query } = ctx;
    const projectId = ctx.params.id;
    const project = await strapi
      .plugin("github-projects")
      .service("projectService")
      .findOne(projectId, query);
    return project;
  } 
});

```

update services:

```ts
import { Strapi } from "@strapi/strapi";
import { Repo } from "../../types";

export default ({ strapi }: { strapi: Strapi }) => ({
  ...
  find: async (query: any) => {
    const projects = await strapi.entityService!.findMany(
      "plugin::github-projects.project",
      query
    );
    return projects;
  },

  findOne: async (projectId: string, query: any) => {
    const project = await strapi.entityService!.findOne(
      "plugin::github-projects.project",
      projectId,
      query
    );
    return project;
  }
});

```

## Internationalization

At the plugin folder, in this case `github-projects`, `src/plugins/github-projects/admin/src/translations`, create a file for eache language you want to support, in this case `en.json` and `pt-BR.json`:

```json
{
  "plugin.name": "Projetos do Github",
  "plugin.description": "Adicionar e remover projetos vindos do Github",
  "home.title": "Repositórios",
  "home.description": "Adicione e remova projetos vindos do Github",
  "table.name": "Nome",
  "table.description": "Descrição",
  "table.url": "URL",
  "table.actions": "Ações",
  "table.project": "Projeto",
  "table.repositories": "Repositórios",
  "bulkActions.text": "Você possui {projectsToCreate} projeto para criar e {projectsToDelete} para excluir",
  "bulkActions.create": "Criar {projectsToCreate} projeto(s)",
  "bulkActions.delete": "Excluir {projectsToDelete} projeto(s)",
  "actions.confirm": "Tem certeza que deseja {action} {name}?",
  "actions.create": "Criar {name}",
  "actions.delete": "Excluir {name}",
  "actions.cancel": "Cancelar {name}",
  "actions.edit": "Editar {name}",
  "actions.success.create": "{entity} {name} criado!",
  "actions.error.create": "Erro ao criar {entity} {name}",
  "actions.success.delete": "{entity} {name} excluido!",
  "actions.error.delete": "Erro ao excluir {entity} {name}",
  "actions.error.fetching": "Erro ao buscar {entity} {name}",
  "no_description": "Sem descrição"
}

```

I decided to create a hook to handle translations at the Helpers folder, in this case `src/plugins/github-projects/admin/src/helpers`, called `useTranslations.ts`, using the `react-intl` library and the `getTrad` (already created by Strapi) function to get the translation from the json file:

```ts
import { useIntl } from "react-intl";
import getTrad from "./getTrad";
import React, { FC, useCallback } from "react";

type Translation = {
  children: string;
  values?: any;
};

export const useTranlation = () => {
  const { formatMessage } = useIntl();

  const t = useCallback(
    (id: string, values?: any) => {
      if (values && !values?.name) {
        values.name = "";
      }
      if (!values) {
        values = { name: "" };
      }
      return formatMessage({ id: getTrad(id) }, values);
    },
    [formatMessage]
  );

  const Trans: FC<Translation> = useCallback(
    (props) => {
      const { children, values } = (props = { ...props });
      return <span>{t(children as string, values)}</span>;
    },
    [formatMessage]
  );
  return { t, Trans };
};

```

Now we can use the hook at the components:
```tsx
t("KEY_OF_THE_TRANSLATION",{
  values: {
    SOME_VAR: "VALUE"
  }
})

//OR

<Trans values={{ SOME_VAR: t("VALUE") }}>
  KEY_OF_THE_TRANSLATION
</Trans>
``` 

sample in use
```tsx
...
title: t("actions.delete", {
  name: `${t("table.repositories")}(s)`,
}) // Delete Repositories(s) ou Excluir Repositório(s)
...

//OR

<Trans values={{ name: `${t("table.repositories")}(s)` }}>
  actions.delete
</Trans>
```

## Extract Plugin's to a separate package

1. Copy the plugin folder to a separate folder, out of the strapi folder tree, in this case `github-projects-plugin`.
Then comment the plugin registration at `./config/plugins.ts` file at the Strapi project folder. 

2. Add strapi as a peer dependency in the plugins package.json file.
```json
...
"peerDependencies": {
    "@strapi/strapi": "*" //any version
  }
...
```
3. add a gitingnore file to the plugin project, to ignore the node_modules folder.

4. create and upload to a git repository.

5. publish to npm as a `scoped public pakage` to your organization npm account.
6. run `npm publish --access public` to publish the plugin to npm, with your organization account.

7. install the plugin into your strapi project, run `npm install @your_organization/github-projects-plugin` at the root of the strapi project.


## References
[Developing Strapi plugins](https://docs.strapi.io/dev-docs/plugins/developing-plugins)

[Strapi Marketplace GuideLines](https://market.strapi.io/guidelines)

[Publushing Strapi plugins](https://missingstrapidocs.com/guide/plugin-guides/publish-plugin.html#publishing-to-npm)

[Plugin Admin panel Available Actions](https://docs.strapi.io/dev-docs/api/plugins/admin-panel-api#available-actions)


[Back](../readme.md)