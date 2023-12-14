/**
 * post service
 */

import { factories } from "@strapi/strapi";
import { EntityService } from "@strapi/types";

export default factories.createCoreService("api::post.post", ({ strapi }) => {
  return {
    // Method 1: Creating an entirely custom service
    async exampleService(...args) {
      let response = { okay: true };

      if (response.okay === false) {
        return { response, error: true };
      }

      return response;
    },

    //custom service to find only public posts
    async findPublic(args: any) {
      const newQuery = {
        ...args,
        filters: {
          ...args.filters,
          isPremium: false,
        },
      };
      const publicPosts = await strapi.entityService.findMany(
        "api::post.post",
        (this as unknown as any).getFetchParams(newQuery)
      );
      return publicPosts;
    },

    async findOneIfPublic(args: any) {
      const { id } = args;

      const post = await strapi.db.query("api::post.post").findOne({
        where: { id, isPremium: false },
      });
      return post;
    },

    async likePost(args: any) {
      const { postId, userId, query } = args;

      //get all likedBy in this post, by default strapi does not populate the likedBy field
      const postToLike: EntityService.GetValues<"api::post.post", string> =
        await strapi.entityService.findOne("api::post.post", postId, {
          populate: { likedBy: true },
        });

      // if user already liked this post, return the post
      const updatedPost = await strapi.entityService.update(
        "api::post.post",
        postId,
        {
          data: {
            likedBy: [...(postToLike.likedBy as string[]), userId],
          },
          ...query,
          populate: {
            likedBy: {
              fields: ["username"],
            },
          },
        }
      );
      return updatedPost;
    },
  };
});
