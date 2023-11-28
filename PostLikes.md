# PostLikes

This feature will allow authenticate users to like posts.
for this we well need to create a relation between the user and the post, and create a new content type to store the likes.
User can like a post only once, and can unlike it.
Instead of use the update action in post controller, we will create a custom route, custon action and custom service to handle the like and unlike actions.

## Creating the relation

At the user model, create a new relation with the post model, name it `likes`, and set the relation type to `many to many`, at the post side name it as `likedBy` (that will be automatically added as a field relation in Post Content type) because a user can like many posts, and a post can be liked by many users.


## Creating the controller

at `./src/api/post/controllers/post.ts` create a new controller called `postLikes` with the following code:

```ts
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