import { Strapi } from "@strapi/strapi";

export default ({ strapi }: { strapi: Strapi }) => ({
  getPublicRepos() {
    return "Welcome to Strapi 🚀";
  },
});
