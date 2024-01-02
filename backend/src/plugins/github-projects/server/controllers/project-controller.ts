import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
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
  },

  create: async (ctx: any) => {
    const repo = ctx.request.body;
    const userId = ctx.state.user.id;
    const newProject = await strapi
      .plugin("github-projects")
      .service("projectService")
      .create(repo, userId);
    return newProject;
  },

  createMany: async (ctx: any) => {
    const repos = ctx.request.body;
    const userId = ctx.state.user.id;
    const newProjects = await strapi
      .plugin("github-projects")
      .service("projectService")
      .createMany(repos, userId);
    return newProjects;
  },

  delete: async (ctx: any) => {
    const projectId = ctx.params.id;
    const deletedProject = await strapi
      .plugin("github-projects")
      .service("projectService")
      .delete(projectId);
    return deletedProject;
  },

  deleteMany: async (ctx: any) => {
    const { projectIds } = ctx.query;
    const deletedProjects = await strapi
      .plugin("github-projects")
      .service("projectService")
      .deleteMany(projectIds);

    return deletedProjects;
  },
});
