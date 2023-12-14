# PostLikes

This feature will allow authenticate users to like posts. For this we well need to create a relation between the user and the post, and create a new content type to store the likes.
User can like a post only once, and can unlike it.
Instead of use the update action in post controller, we will create a custom route, custon action and custom service to handle the like and unlike actions.

## Creating the relation

At the user model, create a new relation with the post model, name it `likes`, and set the relation type to `many to many`, at the post side name it as `likedBy` (that will be automatically added as a field relation in Post Content type) because a user can like many posts, and a post can be liked by many users.


## Creating the controller

at `./src/api/post/controllers/post.ts` create a new controller called `postLikes` with the following code:

```ts
```

## Creating the custom controller action

At `./src/api/post/controllers/post.ts` create a new controller action called `likePost` with the following code:

```ts
{
  ...

  async likePost(ctx) {
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
}
```	

## Creating the custom service

At `./src/api/post/services/post.ts` create a new service called `likePost` with the following code:

```ts
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
```	

## Creating the route

at `./src/api/post/routes` folder, create a new file route called `like-posts.ts` with the following code:

```ts
export default {
  routes: [
    {
      method: "PUT",
      path: "/posts/:id/like", 
      handler: "api::post.post.likePost", // the custom controller action
    },
  ],
};
```