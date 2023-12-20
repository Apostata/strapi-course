# Extending GraphQL API

## Shadow CRUD

Shadow CRUD is a feature that allows you to extend the GraphQL API by adding custom mutations and queries. It is a way to extend the GraphQL API without having to write any code.
at `./src/index.ts`


```ts
...
register({ strapi }: { strapi: Strapi }) {
    const extensionService = strapi.plugin("graphql").service("extension");
    // extensionService.shadowCrud('api::post.post').disable(); //disable GraphQL CRUD for Post
    // extensionService.shadowCrud('api::post.post').disableQueries(); //disable GraphQL Queries for Post
    // extensionService.shadowCrud('api::post.post').disableMutations(); //disable GraphQL Mutations for Post
    // extensionService.shadowCrud('api::post.post').disableSubscriptions(); //disable GraphQL Subscriptions for Post
    // extensionService.shadowCrud('api::post.post').disableFields(['title']); //disable GraphQL Fields for Post
    // extensionService.shadowCrud('api::post.post').disableQueries(['find']); //disable GraphQL Query find for Post
    // extensionService.shadowCrud('api::post.post').disableMutations(['create']); //disable GraphQL Mutation create for Post
    // extensionService.shadowCrud('api::post.post').disableActions(['created', 'update', 'delete']); //disable GraphQL Actions created, update, delete for Post

  },
```	

## Extending GraphQL Schema

```ts
register({ strapi }: { strapi: Strapi }) {

	const extension = ({ nexus }) => ({
      // GraphQL SDL
      typeDefs: `
          type Mutation {
              likePost(id: ID!): PostEntityResponse
          }
      `,
      resolvers: { //like controller in RestAPI
        Mutation: {
          likePost: async(parent, args, ctx, info)=>{
              const {id:postId} = args;
              const userId = ctx.state.user.id;
              const likedPost = await strapi.service("api::post.post").likePost({postId, userId});
              // to format the response
              const { toEntityResponse } = strapi
              .plugin("graphql")
              .service("format").returnTypes;
              const formatterResponse = toEntityResponse(likedPost, {
                args,
                resourceUID: "api::post.post",
              });
              // end format response
            return formatterResponse;
            }
          },
        },

		resolversConfig: {
        'Mutation.likePost': {
          auth: false,
        },
      },
    });
    extensionService.use(extension);
}
```
## Authentication

You will nedd to pass a valid JWT token in the `Authorization` header of your request. and define the scope of the mutation in the `resolversConfig` property of the extension object. In this caso we will need that the user has permission to `api::post.post.likePost` (in Authenticated role, Post entity, have permission to like post), defined in `roles` in Admin panel.

```ts
...
	const extension = ({ nexus }) => ({
      ...

      resolversConfig: {
        'Mutation.likePost': {
          auth: {
            scope: ["api::post.post.likePost"],
          }
        },
      },
  })
  ...
```	


You can add `policies`, `middlewares` to your GraphQL API by using the `resolversConfig` property of the extension object.
see the docs [Extending the schema](https://docs.strapi.io/dev-docs/plugins/graphql#extending-the-schema)

## Cleaning the code

Now that we have the extension object, we can move it to a separate file, and import it in `./src/index.ts`.
As it is a mutation for the Post entity, we will create a folder `./src/api/post/graphql` and create a file `posts.ts` with the following content:

```ts
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

```
so in `./src/index.ts` we will have:

```ts
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
   ...
  };
}

```

[GraphQL plugin configuration](https://docs.strapi.io/dev-docs/plugins/graphql)