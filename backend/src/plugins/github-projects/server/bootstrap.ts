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
    subCategory: "Repositories",
    displayName: "Read github Repositories",
    uid: "repos.read",
    pluginName: "github-projects",
  },
  {
    section: "plugins",
    subCategory: "Projects",
    displayName: "Read Projects Entity",
    uid: "projects.read",
    pluginName: "github-projects",
  },
  {
    section: "plugins",
    subCategory: "Projects",
    displayName: "Create Projects Entity",
    uid: "projects.create",
    pluginName: "github-projects",
  },
  {
    section: "plugins",
    subCategory: "Projects",
    displayName: "Delete Projects Entity",
    uid: "projects.delete",
    pluginName: "github-projects",
  },
];

export default async ({ strapi }: { strapi: Strapi }) => {
  // bootstrap phase
  await strapi.admin?.services.permission.actionProvider.registerMany(
    RBAC_ACTIONS
  );
};
