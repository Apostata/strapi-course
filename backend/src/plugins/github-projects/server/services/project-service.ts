import { Strapi } from "@strapi/strapi";
import { Repo } from "../../types";

export default ({ strapi }: { strapi: Strapi }) => ({
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
  },

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
      repos.map(
        async (repo) =>
          await strapi
            .plugin("github-projects")
            .service("projectService")
            .create(repo, userId)
      )
    );

    return newProjects;
  },

  delete: async (projectId: string) => {
    const project = await strapi.entityService!.delete(
      "plugin::github-projects.project",
      projectId
    );
    return project;
  },

  deleteMany: async (projectIds: string[]) => {
    const deletedProjects = await Promise.all(
      (projectIds || []).map(
        async (projectId) =>
          await strapi
            .plugin("github-projects")
            .service("projectService")
            .delete(projectId)
      )
    );

    return deletedProjects;
  },
});
