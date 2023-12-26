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
