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
  delete: async (projectId: string) => {
    console.log("service projectId", projectId);
    const project = await strapi.entityService!.delete(
      "plugin::github-projects.project",
      projectId
    );
    return project;
  },
});
