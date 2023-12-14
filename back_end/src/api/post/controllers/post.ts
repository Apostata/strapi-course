/**
 * post controller
 */

import { factories } from "@strapi/strapi";

export default factories.createCoreController(
  "api::post.post",
  ({ strapi }) => {
    return {
      // Create a custom action
      async exampleAction(ctx) {
        await strapi
          .service("api::post.post")
          .exampleService({ someParam: "someValue" });
        try {
          ctx.body = "ok";
        } catch (err) {
          ctx.body = err;
        }
      },

      async find(ctx) {
        // if user is authenticated return all posts
        const isAuth = ctx.state.user;
        const { query } = ctx;
        const queryFiltersParams = query.filters;
        const isNotPremium = queryFiltersParams?.["isPremium"]["$eq"] == "true";

        // if user is not authenticated or requestingNoPremium Posts return only unauthenticated posts
        if (!isAuth || isNotPremium) {
          const { results: publicPosts, pagination } = await strapi
            .service("api::post.post")
            .findPublic(ctx.query);
          const sanitizedData = await this.sanitizeOutput(publicPosts, ctx);
          const trasformedRes = this.transformResponse(
            sanitizedData,
            pagination
          );
          return trasformedRes;
        }
        const { data, meta } = await super.find(ctx);
        return { data, meta };
      },

      async findOne(ctx) {
        const isAuth = ctx.state.user;
        const { query } = ctx;
        const { id } = ctx.params;

        if (!isAuth) {
          const singlePost = await strapi
            .service("api::post.post")
            .findOneIfPublic({ id, query });
          const sanitizedData = await this.sanitizeOutput(singlePost, ctx);
          return this.transformResponse(sanitizedData);
        }
        return await super.findOne(ctx);
      },

      async likePost(ctx) {
        // if (!user) {
        //   return ctx.forbidden("You must be logged in to like a post");
        // }
        // in this case we don't need to check if user is authenticated because we are using roles and permissions
        // to allow only authenticated users to like a post
        const user = ctx.state.user;
        const { id: postId } = ctx.params;
        const { query } = ctx;
        const updatedPost = await strapi.service("api::post.post").likePost({
          postId,
          userId: user.id,
          query,
        });
        const sanitizedData = await this.sanitizeOutput(updatedPost, ctx);
        return this.transformResponse(sanitizedData);
      },
    };
  }
);
