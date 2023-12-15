import { Strapi } from "@strapi/strapi";
import likePostMutation from "./api/post/graphql/post";

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register({ strapi }: { strapi: Strapi }) {
    likePostMutation(strapi); // register custom likePostMutation
  },

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: { strapi: Strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ["admin::user"],
      afterCreate: async (event: any) => {
        const {
          result: {
            id,
            firstname,
            lastname,
            username,
            email,
            createdAt,
            updatedAt,
          },
        } = event;
        await strapi.service("api::author.author").create({
          data: {
            id,
            firstname,
            lastname,
            username,
            email,
            createdAt,
            updatedAt,
            admin_user: [id],
          },
        });
      },

      afterUpdate: async (event: any) => {
        const {
          result: { id, firstname, lastname, username, email, updatedAt },
        } = event;
        const filteredAuthors = await strapi.entityService.findMany(
          "api::author.author",
          {
            populate: ["admin_user"],
            filters: {
              admin_user: {
                id,
              },
            },
          }
        );

        if (filteredAuthors?.[0]?.id) {
          await strapi.service("api::author.author").update(id, {
            data: {
              firstname,
              lastname,
              username,
              email,
              updatedAt,
            },
          });
        } else {
          await strapi.service("api::author.author").create({
            data: {
              id,
              firstname,
              lastname,
              username,
              email,
              updatedAt,
              admin_user: [id],
            },
          });
        }
      },

      afterDelete: async (event: any) => {
        const {
          result: { id },
        } = event;
        await strapi.service("api::author.author").delete(id);
      },
    });
  },
};
