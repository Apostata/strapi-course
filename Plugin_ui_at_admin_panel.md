# Create the UI for plugin at Admin Panel

After creating the plugin, we need to create the UI for it at the Admin Panel. We will continue to use the `github-projects` plugin as an example.

customize the plugin at `./plugins/github-projects/admin/src/` folder.
The `index.tsx` file is the entry point for the plugin's UI. It is the file that will be loaded when the plugin is accessed at the Admin Panel.

```ts
import { prefixPluginTranslations } from '@strapi/helper-plugin';

import pluginPkg from '../../package.json';
import pluginId from './pluginId';
import Initializer from './components/Initializer';
import PluginIcon from './components/PluginIcon';

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
        const component = await import('./pages/App');

        return component;
      },
      permissions: [
        // Uncomment to set the permissions of the plugin here
        // {
        //   action: '', // the action name should be plugin::plugin-name.actionType
        //   subject: null,
        // },
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

  async registerTrads(app: any) {
    const { locales } = app;

    const importedTrads = await Promise.all(
      (locales as any[]).map((locale) => {
        return import(`./translations/${locale}.json`)
          .then(({ default: data }) => {
            return {
              data: prefixPluginTranslations(data, pluginId),
              locale,
            };
          })
          .catch(() => {
            return {
              data: {},
              locale,
            };
          });
      })
    );

    return Promise.resolve(importedTrads);
  },
};

```

## Changing the plugin's icon

The plugin's icon is defined at the `./plugins/github-projects/admin/src/components/PluginIcon.tsx` file. It is a React component that returns the icon.

we will change to the Github icon.

```tsx
/**
 *
 * PluginIcon
 *
 */

import React from "react";
import { Github } from "@strapi/icons";// import here

const PluginIcon = () => <Github />; // change here

export default PluginIcon;
```

## Editing the plugin's page

At `./plugins/github-projects/admin/src/pages/App/index.tsx` file. you can edit the plugin's routes.


```tsx
/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AnErrorOccurred } from '@strapi/helper-plugin';
import pluginId from '../../pluginId';
import HomePage from '../HomePage';

const App = () => {
  return (
    <div>
      <Switch>
        <Route path={`/plugins/${pluginId}`} component={HomePage} exact />
        <Route component={AnErrorOccurred} />
      </Switch>
    </div>
  );
};

export default App;

```

as you can see, at this point we have only one route, the `HomePage` component. tha is at `./plugins/github-projects/admin/src/pages/HomePage/index.tsx` file.

```tsx
/*
 *
 * HomePage
 *
 */

import React from 'react';
import pluginId from '../../pluginId';

const HomePage = () => {
  return (
    <div>
      <h1>{pluginId}&apos;s HomePage</h1>
      <p>Happy coding</p>
    </div>
  );
};

export default HomePage;

```

So let's create a component caller `Repo` in components folder.

```tsx
import React, { FC } from "react";

const Repo: FC<any> = () => {
  return (
    <div>
      <h1>Repo</h1>
    </div>
  );
};

export default Repo;

```

now we will import this component a the `HomePage` page.

```tsx
/*
 *
 * HomePage
 *
 */

import React from "react";
import Repo from "../../components/Repo";

const HomePage = () => {
  return (
    <div>
      <Repo />
    </div>
  );
};

export default HomePage;

```

## Strapi design system

This is the design system used by Strapi. That will help us to maintain the same style as the Admin Panel and make our plugin development faster.

Let's change the `Repo` component to use the design system.

```tsx
import React, { FC, useEffect } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Td,
  Th,
  Box,
  BaseCheckbox,
  Typography,
  VisuallyHidden,
  Layout,
  HeaderLayout,
  ContentLayout,
  Loader,
  Flex,
  IconButton,
  Link,
} from "@strapi/design-system";
import { useFetchClient } from "@strapi/helper-plugin";
import { Pencil, Trash, Plus } from "@strapi/icons";
import { Repo } from "../../../../types";
import { useAlert } from "../../hooks/useAlert";
import { useConfirmationDialog } from "../../hooks/useConfirmationDialog";
import BulkActions from "../BulkActions";

const COL_COUNT = 5;

const Repo: FC<any> = () => {
  const [repos, setRepos] = React.useState<Repo[]>([]);
  const [isLoadgin, setIsLoading] = React.useState(false);
  const [selectedRepos, setSelectedRepos] = React.useState<Repo[]>([]);
  const { alert, showAlert, AlertComponent } = useAlert();
  const { dialog, setDialog, isVisible, setIsVisible, DialogComponent } =
    useConfirmationDialog();
  const client = useFetchClient();
  const allCheked = selectedRepos.length === repos.length;
  const isIndeterminate = selectedRepos.length > 0 && !allCheked;
  const projectsToCreate =
    selectedRepos.filter((item) => item.projectId === null).length || 0;
  const projectsToDelete =
    selectedRepos.filter((item) => item.projectId !== null).length || 0;

  const createProject = async (repo: Repo) => {
    try {
      const response = await client.post("/github-projects/project", repo);
      const newRepos = repos.map((repo) => {
        if (repo.id.toString() === response.data.repositoryId) {
          return {
            ...repo,
            projectId: response.data.id,
          };
        }
        return repo;
      });
      setRepos(newRepos);
      showAlert({
        title: `Project ${repo.name} created`,
        message: "Project created successfully",
        variant: "success",
      });
    } catch (err: any) {
      showAlert({
        title: "Error creating project",
        message: err.message,
        variant: "danger",
      });
    }
  };

  const deleteProject = async (repo: Repo) => {
    const { projectId } = repo;
    try {
      const response = await client.del(
        `/github-projects/project/${projectId}`
      );
      console.log(response);
      const newRepos = repos.map((repo) => {
        if (repo.id.toString() === response.data.repositoryId) {
          return {
            ...repo,
            projectId: null,
          };
        }
        return repo;
      });
      setRepos(newRepos);
      showAlert({
        title: `Project ${repo.name} deleted`,
        message: `Project deleted successfully`,
        variant: "success",
      });
    } catch (err: any) {
      showAlert({
        title: `Error deleting project ${repo.name}`,
        message: err.message,
        variant: "danger",
      });
    }
  };

  useEffect(() => {
    setIsLoading(true);
    client
      .get("/github-projects/repos")
      .then((response: any) => {
        setRepos(response.data);
      })
      .catch((err: any) => {
        showAlert({
          title: "Error fetching repositories",
          message: err.message,
          variant: "danger",
        });
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  if (isLoadgin) {
    return (
      <Flex flexDirection="column" height="100vh" justifyContent="center">
        <Loader />
      </Flex>
    );
  }

  return (
    <Box background="neutral100">
      <Layout>
        <Flex justifyContent="flex-start">
          <HeaderLayout
            title="Repositories"
            subtitle="your git repos"
            as="h2"
          />
          {alert && (
            <div>
              <AlertComponent closeLabel="Close" />
            </div>
          )}
        </Flex>
        <ContentLayout>
          <BulkActions<Repo>
            selectedItems={selectedRepos}
            text={`You have ${projectsToCreate} projects to generate and ${projectsToDelete} to delete`}
            actions={[
              {
                show: projectsToCreate > 0,
                label: `Create ${projectsToCreate} project(s)`,
                variant: "success-light",
                icon: (<Plus />) as React.ReactNode,
                function: () => console.log("add"),
              },
              {
                show: projectsToDelete > 0,
                label: `Delete ${projectsToDelete} project(s)`,
                variant: "danger-light",
                icon: (<Trash />) as React.ReactNode,
                function: () => console.log("delete"),
              },
            ]}
          ></BulkActions>
          <Table colCount={COL_COUNT} rowCount={repos.length}>
            <Thead>
              <Tr>
                <Th>
                  <BaseCheckbox
                    aria-label="Select all entries"
                    value={allCheked}
                    indeterminate={isIndeterminate}
                    onValueChange={(value: boolean) => {
                      if (value) {
                        const selRepos = repos.map((repo) => repo);
                        setSelectedRepos(selRepos);
                      } else {
                        setSelectedRepos([]);
                      }
                    }}
                  />
                </Th>
                <Th>
                  <Typography variant="sigma">Name</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Description</Typography>
                </Th>
                <Th>
                  <Typography variant="sigma">Url</Typography>
                </Th>
                <Th>
                  <VisuallyHidden>Actions</VisuallyHidden>
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {repos.map((repo) => {
                const {
                  id,
                  name,
                  shortDescription: description,
                  url,
                  projectId,
                } = repo;
                return (
                  <Tr key={`table-row-${id}`}>
                    <Td>
                      <BaseCheckbox
                        aria-label={`Select-${id}`}
                        value={selectedRepos.includes(repo)}
                        onValueChange={(value: boolean) => {
                          if (value) {
                            setSelectedRepos([...selectedRepos, repo]);
                          } else {
                            setSelectedRepos(
                              selectedRepos.filter(
                                (selectedRepo) => selectedRepo.id !== repo.id
                              )
                            );
                          }
                        }}
                      />
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">{name}</Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        {description ?? "no description"}
                      </Typography>
                    </Td>
                    <Td>
                      <Typography textColor="neutral800">
                        <Link href={url} isExternal>
                          {url}
                        </Link>
                      </Typography>
                    </Td>
                    <Td>
                      {projectId ? (
                        <Flex>
                          <Link
                            alt={`Edit ${name}`}
                            to={`/content-manager/collectionType/plugin::github-projects.project/${projectId}`}
                          >
                            <IconButton
                              onClick={() => console.log("edit")}
                              label="Edit"
                              noBorder
                              icon={<Pencil />}
                            />
                          </Link>
                          <Box paddingLeft={1}>
                            <IconButton
                              onClick={() => {
                                setDialog({
                                  ...dialog,
                                  title: "Delete project",
                                  description: `Are you sure you want to delete ${repo.name}?`,
                                  onClose: {
                                    label: "Cancel",
                                    function: () => setIsVisible(false),
                                  },
                                  onConfirm: {
                                    label: "Delete",
                                    function: () => {
                                      deleteProject(repo);
                                      setIsVisible(false);
                                    },
                                  },
                                });
                                setIsVisible(true);
                              }}
                              label="Delete"
                              noBorder
                              icon={<Trash />}
                            />
                          </Box>
                        </Flex>
                      ) : (
                        <Flex>
                          <IconButton
                            onClick={() => createProject(repo)}
                            label="Add"
                            noBorder
                            icon={<Plus />}
                          />
                        </Flex>
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Tbody>
          </Table>
        </ContentLayout>
        <DialogComponent />
      </Layout>
    </Box>
  );
};

export default Repo;

```	

As you can see, we are using the `useFetchClient` hook to make the request to the backend route we created before. This hook is provided by the `@strapi/helper-plugin` package.

[Strapi Design system](https://design-system-git-main-strapijs.vercel.app/?path=/docs/design-system-primitives-combobox--docs)

## Applying the plugin's permissions

At this point, we have the plugin's UI and the backend route, But every logged person can access it. Now we need to apply the permissions to the plugin. Let's fix that.

at `./plugins/github-projects/server/routes/index.tsx` file.

```tsx
export default [
  {
    method: "GET",
    path: "/repos", //accessible at http://localhost:1337/github-projects/repos
    handler: "getReposController.index",
    config: {
      policies: ["admin::isAuthenticatedAdmin"], // only admin can access
    },
  },
];
```

## Generating a single project from the plugin action (ADD)

### Adding the route
Adding a new route at `./plugins/github-projects/server/routes/index.tsx` file.

```tsx
export default [
  ...
  {
    method: "POST",
    path: "/project",
    handler: "projectController.create",
    config: {
      policies: ["admin::isAuthenticatedAdmin"], //somente admin pode acessar
    },
  },
];
```

### Adding the controller

```tsx
import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  create: async (ctx: any) => {
    const repo = ctx.request.body;
    const userId = ctx.state.user.id;
    const newProject = await strapi
      .plugin("github-projects")
      .service("projectService")
      .create(repo, userId);
    return newProject;
  },
});

```

### Adding the service

```tsx
import { Strapi } from "@strapi/strapi";
import { Repo } from "../../types";

export default ({ strapi }: { strapi: Strapi }) => ({
  create: async (repo: Repo, userId: string) => {
    const newProject = await strapi.entityService!.create(
      "plugin::github-projects.project",
      {
        data: {
          repositoryId: `${repo.id}`,
          title: repo.name,
          shortDescription: repo.shortDescription,
          longDescription: repo.longDescription,
          repositoryUrl: repo.url,
          createdBy: userId,
          updatedBy: userId,
        },
      }
    );
    return newProject;
  },
});

```

## Deleting a single project from the plugin action (DELETE)

### Adding the route

```tsx

export default [
 ...
  {
    method: "DELETE",
    path: "/project/:id",
    handler: "projectController.delete",
    config: {
      policies: ["admin::isAuthenticatedAdmin"], //somente admin pode acessar
    },
  },
];

```

### Adding the controller

```tsx
import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
 ...
  delete: async (ctx: any) => {
    console.log("controller params", ctx.params);
    const projectId = ctx.params.id;
    console.log("controller projectId", projectId);
    const deletedProject = await strapi
      .plugin("github-projects")
      .service("projectService")
      .delete(projectId);
    return deletedProject;
  },
});

```

### Adding the service

```tsx
export default ({ strapi }: { strapi: Strapi }) => ({
 ...
  delete: async (projectId: string) => {
    console.log("service projectId", projectId);
    const project = await strapi.entityService!.delete(
      "plugin::github-projects.project",
      projectId
    );
    return project;
  },
});
```

## Generating multiple projects from the plugin action (BULK ADD)

### Adding the route

```tsx
export default [
  ...
  {
    method: "POST",
    path: "/projects",
    handler: "projectController.createMany",
    config: {
      policies: ["admin::isAuthenticatedAdmin"], //somente admin pode acessar
    },
  },
...
];

```	

### Adding the controller

```tsx
import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  ...
  createMany: async (ctx: any) => {
    const repos = ctx.request.body;
    const userId = ctx.state.user.id;
    const newProjects = await strapi
      .plugin("github-projects")
      .service("projectService")
      .createMany(repos, userId);
    return newProjects;
  },

 ...
});

```

### Adding the service

```tsx
import { Strapi } from "@strapi/strapi";
import { Repo } from "../../types";

export default ({ strapi }: { strapi: Strapi }) => ({
  ...
  create: async (repo: Repo, userId: string) => {
    const newProject = await strapi.entityService!.create(
      "plugin::github-projects.project",
      {
        data: {
          repositoryId: `${repo.id}`,
          title: repo.name,
          shortDescription: repo.shortDescription,
          longDescription: repo.longDescription,
          repositoryUrl: repo.url,
          createdBy: userId,
          updatedBy: userId,
        },
      }
    );
    return newProject;
  },

  createMany: async (repos: Repo[], userId: string) => {
    const newProjects = await Promise.all(
      (repos || []).map(
        async (repo) =>
          await strapi
            .plugin("github-projects")
            .service("projectService")
            .create(repo, userId)
      )
    );

    return newProjects;
  },

  ...
});

```
