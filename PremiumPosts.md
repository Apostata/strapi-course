# Premium Posts

## Find All Posts

Example of how to implement premium posts in a blog application with Strapi customizations.

### Solution 1: worst solution, but the simplest one

At posts controller, override the find action, and filter the posts by the user's authentication status.

```ts
// Override the findOne action
      async find(ctx) {
        // fetch all posts, core method
        const { data, meta } = await super.find(ctx);
        if (ctx.state.user) { // if user is authenticated return all posts
          return { data, meta };
        } else { // if user is not authenticated return only unauthenticated posts
          const unauthenticatedData = data.filter(
            (post) => !post.attributes.isPremium
          );
          return { data: unauthenticatedData, meta };
        }
      },
```

**Pros:**

1. Simple to implement

**Cons:**

1. Fetch all posts from the database, and filter them in the backend, this is not a good practice, because the database can have a lot of posts, and the user will only see a few of them, and the database will be overloaded.

2. Controller action is doing too much, it is fetching the data, and filtering it, this is not a good practice, because the controller action should only be responsible for fetching the data, and the filtering should be done in the service layer.


### Solution 2: better solution, but not the best ones

At posts controller, override the find action, and filter the posts by the user's authentication status.

```ts
	// Solution 2 for premium posts
      async find(ctx) {
        // if user is authenticated return all posts
        const isAuth = ctx.state.user;
        const { query } = ctx;
        const queryFiltersParams = query.filters;
        console.log(queryFiltersParams);
        const isNotPremium = queryFiltersParams?.["isPremium"]["$eq"] == "true";

        // if user is not authenticated or requestingNoPremium Posts return only unauthenticated posts
        if (!isAuth || isNotPremium) {
          const { results, pagination } = await strapi
            .service("api::post.post")
            .find({
              ...query,
              filters: {
                queryFiltersParams,
                isPremium: false,
              },
            });

          const sanitizedData = await this.sanitizeOutput(results, ctx);
          const trasformedRes = this.transformResponse(
            sanitizedData,
            pagination
          );
          return trasformedRes;
        }
        const { data, meta } = await super.find(ctx);
        return { data, meta };
      }
```

### Solution 3: best solution

This is the same solution as the previous one, but we will override the controller action, and create a custom service to call the public posts.

At controller(`src/api/post/controllers/post.js`):

```ts
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
            .findPublic(ctx.query); // call the custom service to fetch the public posts
          const sanitizedData = await this.sanitizeOutput(publicPosts, ctx);
          const trasformedRes = this.transformResponse(
            sanitizedData,
            pagination
          );
          return trasformedRes;
        }
        // if user is authenticated and requesting premium posts return all posts
        const { data, meta } = await super.find(ctx);
        return { data, meta };
      },

```

At custom service(`src/api/post/services/post.js`):

```ts
async findPublic(args: any) {
      const newQuery = { // override the query to fetch only public posts but with all the other params
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
```

## Find One Premium Post

### Solution 1: good solution but not the best one

At posts controller, override the findOne action, and create a custom service to call the post.

At controller(`src/api/post/controllers/post.js`):

```ts
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
```

At custom service(`src/api/post/services/post.js`):

```ts
async findOneIfPublic(args: any) {
      const { id, query } = args;

      const post = await strapi.entityService.findOne(
        "api::post.post",
        id,
        (this as unknown as any).getFetchParams(query)
      );
      return post.isPremium ? null : post;
    },
```

This is not the best solution because you always call the database, and then you filter the data if its is a premium post or not, this is not a good practice.


### Solution 2: best solution

At posts controller we will maintain the same logic as the previous solution, but we will override the findOne service with a custom entity call.

At custom service(`src/api/post/services/post.js`):

```ts
async findOneIfPublic(args: any) {
      const { id } = args;

      const post = strapi.db.query("api::post.post").findOne({
        where: { id, isPremium: false },
      });
      return post;
    },
```

in this solution we are calling the database directly, and we are not using the entity service, this is a good practice because we are not fetching all the data from the database, and then filtering it, we are only fetching the data we need.