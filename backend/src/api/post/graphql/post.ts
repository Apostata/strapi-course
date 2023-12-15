import { Strapi } from "@strapi/strapi";

const likePostMutation = (strapi: Strapi) => {
  const extensionService = strapi.plugin("graphql").service("extension");

  const extension = ({ nexus }) => ({
    // GraphQL SDL
    typeDefs: `
          type Mutation {
              likePost(id: ID!): PostEntityResponse
          }
      `,
    resolvers: {
      //like controller in RestAPI
      Mutation: {
        likePost: async (parent, args, ctx, info) => {
          const { id: postId } = args;
          const userId = ctx.state.user.id;
          const likedPost = await strapi
            .service("api::post.post")
            .likePost({ postId, userId });
          const { toEntityResponse } = strapi
            .plugin("graphql")
            .service("format").returnTypes;
          const formatterResponse = toEntityResponse(likedPost, {
            args,
            resourceUID: "api::post.post",
          });
          return formatterResponse;
        },
      },
    },

    resolversConfig: {
      "Mutation.likePost": {
        auth: {
          scope: ["api::post.post.likePost"], // permissions required, in this case, the user must have the permission to like a post
        },
      },
    },
  });

  extensionService.use(extension);
};

export default likePostMutation;
